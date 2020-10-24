interface Token {
  type: string;
  content?: string;
  isSelfClosing?: boolean;
  tagName?: string;
}

interface Attribute {
  name: string;
  value?: string;
}
