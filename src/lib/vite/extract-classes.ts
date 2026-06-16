import { parse } from 'svelte/compiler';

/**
 * A non-literal (dynamic) class expression found in the source. These fall
 * outside the authoring grammar (static + conditional-literal classes), so the
 * build can later hard-fail on them with a precise location.
 */
export interface DynamicClass {
	/** The offending expression's source text, e.g. `'bg-' + color`. */
	expression: string;
	/** The expression's start offset into the original source, when known. */
	start?: number;
}

/**
 * The result of {@link extractClasses}: every literal Tailwind class token used
 * in the template, plus the list of dynamic class expressions to reject.
 */
export interface ExtractResult {
	/** De-duplicated literal class tokens, in first-seen (stable) order. */
	classes: string[];
	/** Non-literal class expressions the build must reject. */
	dynamic: DynamicClass[];
}

/** What analyzing a single ESTree class expression yields. */
interface ExpressionAnalysis {
	tokens: string[];
	dynamic: DynamicClass[];
}

/** A minimal structural view of the ESTree/Svelte nodes we walk. */
interface AstNode {
	type: string;
	start?: number;
	end?: number;
	[key: string]: unknown;
}

function isNode(value: unknown): value is AstNode {
	return typeof value === 'object' && value !== null && typeof (value as AstNode).type === 'string';
}

/** Split a raw class string into non-empty, whitespace-trimmed tokens. */
function tokenize(value: string): string[] {
	return value.split(/\s+/).filter((token) => token.length > 0);
}

/**
 * Analyze an ESTree class expression (from a `class={…}` `ExpressionTag` or a
 * nested interpolation) into its literal tokens and any dynamic sub-expressions.
 *
 * Recognized literal shapes:
 * - `Literal` (string) → its tokens.
 * - `TemplateLiteral` → each cooked quasi's tokens; interpolations recursed.
 * - `ConditionalExpression` → `consequent` + `alternate` (the `test` is ignored).
 * - `LogicalExpression` `&&` → `right` only (the left is the condition).
 * - `LogicalExpression` `||`/`??` → `left` + `right` (fallback pattern).
 * - `ArrayExpression` → each element recursed.
 *
 * Anything else (`Identifier`, `MemberExpression`, `CallExpression`,
 * `BinaryExpression`, …) is reported as dynamic, capturing its source slice.
 */
function analyzeExpression(node: AstNode, source: string): ExpressionAnalysis {
	const tokens: string[] = [];
	const dynamic: DynamicClass[] = [];

	const merge = (analysis: ExpressionAnalysis) => {
		tokens.push(...analysis.tokens);
		dynamic.push(...analysis.dynamic);
	};

	switch (node.type) {
		case 'Literal': {
			if (typeof node.value === 'string') {
				tokens.push(...tokenize(node.value));
			} else {
				// Non-string literal (number/boolean/null/regex) — not a usable class.
				dynamic.push(markDynamic(node, source));
			}
			break;
		}

		case 'TemplateLiteral': {
			const quasis = (node.quasis ?? []) as AstNode[];
			for (const quasi of quasis) {
				const cooked = (quasi.value as { cooked?: string | null } | undefined)?.cooked;
				if (typeof cooked === 'string') tokens.push(...tokenize(cooked));
			}
			const expressions = (node.expressions ?? []) as AstNode[];
			for (const expression of expressions) {
				if (isNode(expression)) merge(analyzeExpression(expression, source));
			}
			break;
		}

		case 'ConditionalExpression': {
			const consequent = node.consequent;
			const alternate = node.alternate;
			if (isNode(consequent)) merge(analyzeExpression(consequent, source));
			if (isNode(alternate)) merge(analyzeExpression(alternate, source));
			break;
		}

		case 'LogicalExpression': {
			const left = node.left;
			const right = node.right;
			if (node.operator === '&&') {
				// `cond && 'literal'` — only the right side carries classes.
				if (isNode(right)) merge(analyzeExpression(right, source));
			} else {
				// `||` / `??` — fallback pattern; both sides may be class sources.
				if (isNode(left)) merge(analyzeExpression(left, source));
				if (isNode(right)) merge(analyzeExpression(right, source));
			}
			break;
		}

		case 'ArrayExpression': {
			const elements = (node.elements ?? []) as Array<AstNode | null>;
			for (const element of elements) {
				if (isNode(element)) merge(analyzeExpression(element, source));
			}
			break;
		}

		default: {
			dynamic.push(markDynamic(node, source));
			break;
		}
	}

	return { tokens, dynamic };
}

/** Capture a node as a dynamic class, slicing its source text when offsets exist. */
function markDynamic(node: AstNode, source: string): DynamicClass {
	if (typeof node.start === 'number' && typeof node.end === 'number') {
		return { expression: source.slice(node.start, node.end), start: node.start };
	}
	return { expression: `<${node.type}>` };
}

/**
 * Extract every literal Tailwind class token from a `.svelte` source, and report
 * the non-literal (dynamic) class expressions that the build must reject.
 *
 * Pure and read-only: it parses with `svelte/compiler`'s modern `parse`, walks
 * the template AST, and inspects `class` attributes (`Text` + `ExpressionTag`)
 * and `class:name` directives. No source is edited and no Tailwind is compiled.
 *
 * @param source The `.svelte` file contents.
 * @param filename Optional filename, forwarded to `parse` for error messages.
 */
export function extractClasses(source: string, filename?: string): ExtractResult {
	const ast = parse(source, { modern: true, filename }) as unknown as { fragment?: unknown };

	const tokens: string[] = [];
	const dynamic: DynamicClass[] = [];

	/** Handle the `value` of a `class` Attribute (`true` | node | node[]). */
	const handleClassValue = (value: unknown) => {
		if (value === true) return; // boolean `class` attribute — nothing to extract.
		const parts = Array.isArray(value) ? value : [value];
		for (const part of parts) {
			if (!isNode(part)) continue;
			if (part.type === 'Text') {
				const data = typeof part.data === 'string' ? part.data : '';
				tokens.push(...tokenize(data));
			} else if (part.type === 'ExpressionTag') {
				const expression = part.expression;
				if (isNode(expression)) {
					const analysis = analyzeExpression(expression, source);
					tokens.push(...analysis.tokens);
					dynamic.push(...analysis.dynamic);
				}
			}
		}
	};

	/** Inspect an element-like node's `attributes` for classes. */
	const handleAttributes = (attributes: unknown) => {
		if (!Array.isArray(attributes)) return;
		for (const attribute of attributes) {
			if (!isNode(attribute)) continue;
			if (attribute.type === 'Attribute' && attribute.name === 'class') {
				handleClassValue(attribute.value);
			} else if (attribute.type === 'ClassDirective') {
				// `class:name={cond}` — `name` is a literal token; the condition is ignored.
				if (typeof attribute.name === 'string') tokens.push(...tokenize(attribute.name));
			}
			// SpreadAttribute and all other attribute kinds are irrelevant for classes.
		}
	};

	// Generic deep walk: recurse arrays and any object carrying a `type`. This
	// naturally covers RegularElement/Component/SvelteElement (attributes) and
	// block nodes (IfBlock/EachBlock/SnippetBlock/…) via their child fragments.
	const seen = new Set<unknown>();
	const walk = (value: unknown) => {
		if (Array.isArray(value)) {
			for (const item of value) walk(item);
			return;
		}
		if (!isNode(value) || seen.has(value)) return;
		seen.add(value);

		if ('attributes' in value) handleAttributes(value.attributes);

		for (const key of Object.keys(value)) {
			if (key === 'type' || key === 'start' || key === 'end') continue;
			walk((value as Record<string, unknown>)[key]);
		}
	};

	walk(ast.fragment);

	return { classes: dedupe(tokens), dynamic };
}

/** De-duplicate while preserving first-seen order. */
function dedupe(items: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const item of items) {
		if (!seen.has(item)) {
			seen.add(item);
			out.push(item);
		}
	}
	return out;
}
