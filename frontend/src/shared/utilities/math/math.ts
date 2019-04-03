/**
 * Rounds the specified value to at most the specified number of fraction digits.
 * Note that this always rounds away from zero.
 * @param value The value to round.
 * @param maxFractionDigits The max number of fraction digits to round to. The default is 0.
 */
export function roundNumber(value: number, maxFractionDigits: number = 0): number
{
    const sign = Math.sign(value);

    // tslint:disable-next-line: restrict-plus-operands prefer-template
    return sign * +(Math.round(+`${value * sign}e+${maxFractionDigits}`)  + `e-${maxFractionDigits}`);
}
