import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as cheerio from "cheerio";
import type { PlainObject, Primitive } from "ts-basic-types";
import type { YtInitialPlayerResponse } from "./types/YtInitialPlayerResponse";

export function extractYtInitialPlayerResponse(htmlContent: string): YtInitialPlayerResponse | null {
	const $ = cheerio.load(htmlContent);

	const scriptTags = $("script");

	for (let i = 0; i < scriptTags.length; i++) {
		const scriptContent = $(scriptTags[i]).html();

		if (!scriptContent || scriptContent.trim() === "") {
			continue;
		}

		try {
			const ast = parse(scriptContent, {
				sourceType: "script",
				allowImportExportEverywhere: true,
				allowReturnOutsideFunction: true,
			});

			let ytInitialPlayerResponse: YtInitialPlayerResponse | null = null;

			traverse(ast, {
				VariableDeclarator(path) {
					if (t.isIdentifier(path.node.id) && path.node.id.name === "ytInitialPlayerResponse") {
						if (t.isObjectExpression(path.node.init)) {
							ytInitialPlayerResponse = evaluateObjectExpression(path.node.init);
						} else if (t.isStringLiteral(path.node.init)) {
							try {
								ytInitialPlayerResponse = JSON.parse(path.node.init.value);
							} catch {
								ytInitialPlayerResponse = path.node.init.value as YtInitialPlayerResponse;
							}
						}
					}
				},

				AssignmentExpression(path) {
					if (t.isMemberExpression(path.node.left)) {
						const object = path.node.left.object;
						const property = path.node.left.property;

						if (
							t.isIdentifier(object) &&
							object.name === "window" &&
							t.isIdentifier(property) &&
							property.name === "ytInitialPlayerResponse"
						) {
							if (t.isObjectExpression(path.node.right)) {
								ytInitialPlayerResponse = evaluateObjectExpression(path.node.right);
							} else if (t.isStringLiteral(path.node.right)) {
								try {
									ytInitialPlayerResponse = JSON.parse(path.node.right.value);
								} catch {
									ytInitialPlayerResponse = path.node.right.value as YtInitialPlayerResponse;
								}
							}
						}
					} else if (t.isIdentifier(path.node.left) && path.node.left.name === "ytInitialPlayerResponse") {
						if (t.isObjectExpression(path.node.right)) {
							ytInitialPlayerResponse = evaluateObjectExpression(path.node.right);
						} else if (t.isStringLiteral(path.node.right)) {
							try {
								ytInitialPlayerResponse = JSON.parse(path.node.right.value);
							} catch {
								ytInitialPlayerResponse = path.node.right.value as YtInitialPlayerResponse;
							}
						}
					}
				},
			});

			if (ytInitialPlayerResponse !== null) {
				return ytInitialPlayerResponse;
			}
		} catch {}
	}

	return null;
}

function evaluateObjectExpression(node: t.ObjectExpression): PlainObject {
	const result: PlainObject = {};

	node.properties.forEach((prop) => {
		if (t.isObjectProperty(prop)) {
			let key: string;

			if (t.isIdentifier(prop.key)) {
				key = prop.key.name;
			} else if (t.isStringLiteral(prop.key)) {
				key = prop.key.value;
			} else {
				return;
			}

			if (t.isStringLiteral(prop.value)) {
				result[key] = prop.value.value;
			} else if (t.isNumericLiteral(prop.value)) {
				result[key] = prop.value.value;
			} else if (t.isBooleanLiteral(prop.value)) {
				result[key] = prop.value.value;
			} else if (t.isNullLiteral(prop.value)) {
				result[key] = null;
			} else if (t.isObjectExpression(prop.value)) {
				result[key] = evaluateObjectExpression(prop.value);
			} else if (t.isArrayExpression(prop.value)) {
				result[key] = evaluateArrayExpression(prop.value);
			}
		}
	});

	return result;
}

type PrimitiveArray = (Primitive | PlainObject | PrimitiveArray)[];
function evaluateArrayExpression(node: t.ArrayExpression): PrimitiveArray {
	const result: PrimitiveArray = [];

	node.elements.forEach((element) => {
		if (element === null) {
			result.push(null);
		} else if (t.isStringLiteral(element)) {
			result.push(element.value);
		} else if (t.isNumericLiteral(element)) {
			result.push(element.value);
		} else if (t.isBooleanLiteral(element)) {
			result.push(element.value);
		} else if (t.isNullLiteral(element)) {
			result.push(null);
		} else if (t.isObjectExpression(element)) {
			result.push(evaluateObjectExpression(element));
		} else if (t.isArrayExpression(element)) {
			result.push(evaluateArrayExpression(element));
		}
	});

	return result;
}
