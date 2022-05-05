interface Attributes {
  index: number,
  timestamp: number,
  data: string,
  "previous-hash": string,
  hash: string
}

export interface Block {
  id: string,
  type: string,
  attributes: Attributes
}
