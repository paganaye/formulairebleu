export type IQuery = UnaryOperator | BinaryOperator | FieldValue | MemberOperator | ConstValue;

export type UnaryOperator = {
    type: 'unary';
    operator: '+' | '-' | '!';
    operand1: IQuery;
};

export type BinaryOperator = {
    type: 'binary';
    operator:
    | '+'
    | '-'
    | '*'
    | '/'
    | '<'
    | '>'
    | '<='
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||'
    | '.'
    | '??';
    operand1: IQuery;
    operand2: IQuery;
};

export type FieldValue = {
    type: 'field';
    field: string;
};

export type MemberOperator = {
    type: 'member';
    member: string;
};

export type ConstValue = {
    type: 'const';
    value: string;
    encoding?: 'utf8' | 'base64' | 'json';
    view?: 'text' | 'html' | 'image' | 'file' | 'object';
};
