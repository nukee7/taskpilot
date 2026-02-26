export function resolveExpressions(
  input: any,
  contextData: Record<string, any>
): any {

  // Case 1: String → replace {{ }}
  if (typeof input === 'string') {
    return resolveString(input, contextData);
  }

  // Case 2: Array → map
  if (Array.isArray(input)) {
    return input.map(item =>
      resolveExpressions(item, contextData)
    );
  }

  // Case 3: Object → recurse
  if (typeof input === 'object' && input !== null) {
    const result: any = {};

    for (const key in input) {
      result[key] = resolveExpressions(
        input[key],
        contextData
      );
    }

    return result;
  }

  // Case 4: Primitive → return
  return input;
}

function resolveString(
  text: string,
  data: Record<string, any>
): string {

  const regex = /\{\{(.+?)\}\}/g;

  return text.replace(regex, (_, expr) => {
    try {
      return resolvePath(expr.trim(), data);
    } catch {
      return '';
    }
  });
}

function resolvePath(
  expression: string,
  data: Record<string, any>
): string {

  // Expect: node.1.output.raw
  const parts = expression.split('.');

  if (parts[0] !== 'node') {
    throw new Error('Invalid expression');
  }

  const nodeId = parts[1];

  if (!data[nodeId]) {
    return '';
  }

  let value: any = data[nodeId];

  // Walk down object
  for (let i = 2; i < parts.length; i++) {
    if (value == null) return '';
    value = value[parts[i]];
  }

  // Convert JSON → readable
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}