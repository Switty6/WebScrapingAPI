import * as fs from 'fs';
import * as path from 'path';


const positiveWords: string[] = []
const negativeWords: string[] = [];
const negations: string[] = ['not', 'isn\'t', 'wasn\'t', 'aren\'t', 'weren\'t', 'don\'t', 'doesn\'t', 'nor'];

export function cachePositiveWords() {
    const file = path.join(__dirname, '../assets/positive-words.txt');
    if (!fs.existsSync(file)) {
        console.error('Positive words file not found!');
        return;
    }
    try {
        const positivedata = fs.readFileSync(file, 'utf8');
        const lines = positivedata.split(/\r?\n/);
        const words: string[] = lines.filter(line => line.trim() !== '');

        positiveWords.push(...words);
    } catch (err: any) {
        console.error(`Error reading positive words file: ${err.message}`);
    }
}

export function cacheNegativeWords() {
    const file = path.join(__dirname, '../assets/negative-words.txt');
    const negativedata = fs.readFileSync(file, 'utf8');
    const lines = negativedata.split(/\r?\n/);
    const words: string[] = lines.filter(line => line.trim() !== '');

    negativeWords.push(...words);
}

export function tokenize(text: string): string[] {
    const tokenized = text.toLowerCase().replace(/\n+/g, ' ').split(/\W+/).filter(word => word.length > 0);

    return tokenized
}

function getSentimentScore(text: string): number {
    const words = tokenize(text);

    let score = 0;
    let negateNext = false;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (negateNext) {
            if (positiveWords.includes(word)) {
                score -= 1;
            } else if (negativeWords.includes(word)) {
                score += 1;
            }

            if (i < words.length - 1) {
                const bigram = word + ' ' + words[i + 1];
                if (positiveWords.includes(bigram)) {
                    score -= 1;
                } else if (negativeWords.includes(bigram)) {
                    score += 1;
                }
            }
            negateNext = false;
        } else {
            if (positiveWords.includes(word)) {
                score += 1;
            } else if (negativeWords.includes(word)) {
                score -= 1;
            }

            if (i < words.length - 1) {
                const bigram = word + ' ' + words[i + 1];
                if (positiveWords.includes(bigram)) {
                    score += 1;
                } else if (negativeWords.includes(bigram)) {
                    score -= 1;
                }
            }
        }

        if (negations.includes(word)) {
            negateNext = true;
        }
    }

    return score;
}

export function analyzeSentiment(text: string): string {
    const score = getSentimentScore(text);
    if (score > 0) {
        return 'positive';
    } else if (score < 0) {
        return 'negative';
    } else {
        return 'neutral';
    }
}
