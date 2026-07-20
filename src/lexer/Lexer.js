import { TokenType } from "../token/TokenType.js";
import { Token } from "../token/Token.js";


const KEYWORDS = {
    say: TokenType.SAY,
    let: TokenType.LET,

    true: TokenType.TRUE,
    false: TokenType.FALSE,

    if: TokenType.IF,
    else: TokenType.ELSE,
    while: TokenType.WHILE,

    fun: TokenType.FUN,
    return: TokenType.RETURN
};

export class Lexer {

    constructor(source) {
        this.source = source;
        this.current = 0;
        this.line = 1;
        this.column = 1;
        this.tokens = [];
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    advance() {
        const char = this.source[this.current++];

        if (char === '\n') {
            this.line++;
            this.column = 1;
        } else {
            this.column++;
        }
        return char;
    }
    peek() {
        if (this.isAtEnd()) {
            return '\0';
        }
        return this.source[this.current];
    }
    
    isAlpha(char) {
        return /^[a-zA-Z_]$/.test(char);
    }

    isAlphaNumeric(char) {
        return /^[a-zA-Z0-9_]$/.test(char);
    }
    
    string() {
        let value = "";
        while (!this.isAtEnd() && this.peek() !== '"') {
            value += this.advance();
        }
        if (this.isAtEnd()) {
            throw new Error("Unterminated string.");
        }
        this.advance(); // Consume the closing quote
        this.addToken(TokenType.STRING, value);
    }
    
    identifier(firstChar) {
        let text = firstChar;
        while (!this.isAtEnd() && this.isAlphaNumeric(this.peek())) {
            text += this.advance();
        }
        const type = KEYWORDS[text] || TokenType.IDENTIFIER;
        this.addToken(type, text);
    }
    
    isDigit(char) {
        return /^[0-9]$/.test(char);
    }

    number(firstChar) {
        let value = firstChar;
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            value += this.advance();
        }
        //memfukung desimal
        if (this.peek() === '.') {
            value += this.advance();
            while (!this.isAtEnd() && this.isDigit(this.peek())) {
                value += this.advance();
            }
        }
        this.addToken(TokenType.NUMBER, parseFloat(value));
    }

    match(expected) {
        if (this.isAtEnd()) {
            return false;
        }
        if (this.source[this.current] !== expected) {
            return false;
        }
        this.current++;
        this.column++;
        return true;
    }

    addToken(type, value = null) {
        this.tokens.push(new Token(type, value,  this.line, this.column));
    }

    scanToken() {
        // this.startline = this.line;
        // this.startcolumn = this.column;

        const char = this.advance();
        
        if (this.isAlpha(char)) {
            this.identifier(char);
            return;
        }
        if (this.isDigit(char)) {
            this.number(char);
            return;
        }

        switch (char) {
            case '"':
                this.string();
                break;
            case ' ':
            case '\r':
            case '\t':
                break; // Ignore whitespace.
            case '\n':
                break;
            
            case '+':
                this.addToken(TokenType.PLUS);
                break;
            case '-':
                this.addToken(TokenType.MINUS);
                break;
            case '*':
                this.addToken(TokenType.STAR);  
                break;
            case '/':
                this.addToken(TokenType.SLASH);
                break;
            case "(":
                this.addToken(TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(TokenType.RIGHT_PAREN);
                break;
            case ",":
                this.addToken(TokenType.COMMA);
                break;
            case "=":
            if (this.match('=')){
                this.addToken(TokenType.EQUAL_EQUAL);
            } else {
                this.addToken(TokenType.EQUAL);
            }
            break;
            case "!":
            if (this.match('=')){
                this.addToken(TokenType.BANG_EQUAL);
            }
            break;
            case ">":
            if (this.match('=')){
                this.addToken(TokenType.GREATER_EQUAL);
            } else {
                this.addToken(TokenType.GREATER);
            }
            break;
            case "<":
            if (this.match('=')){
                this.addToken(TokenType.LESS_EQUAL);
            } else {
                this.addToken(TokenType.LESS);
            }
            break;
            case "{":
                this.addToken(TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(TokenType.RIGHT_BRACE);
                break;

            case "[":
                this.addToken(TokenType.LEFT_BRACKET);
            break;

            case "]":
                this.addToken(TokenType.RIGHT_BRACKET);
            break;
              
            default:
            throw new Error(`Unexpected character: ${char}`)
        }
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.scanToken();
        }

        this.tokens.push(
            new Token(TokenType.EOF, null, this.line, this.column)
        );

        return this.tokens;
    }


}