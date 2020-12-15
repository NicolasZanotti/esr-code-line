const CHECK_DIGIT_TABLE = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];
const AUXILIARY_CHARACTER_1 = ">";
const AUXILIARY_CHARACTER_2 = "+";
const AUXILIARY_CHARACTER_3 = ">";

/*
  Modulo 10, recursive
  @see http://www.hosang.ch/modulo10.aspx
 */
export function checkDigit(code: string): number {
  const numbers = code.split("");
  let carry: any = 0;

  for (let i = 0, j = 0; i < numbers.length; i++) {
    j = parseInt(carry, 10) + parseInt(numbers[i], 10);
    carry = CHECK_DIGIT_TABLE[j % 10];
  }

  return (10 - carry) % 10;
}

export const attachCheckDigit = (code: string): string =>
  code + checkDigit(code).toString();

export function pad(s: string, n: number): string {
  let zeros = "";
  for (let i = 0; i < n - s.length; i++) zeros += "0";
  return zeros + s;
}

export function toSubscriberNumber(customerNumber: string): string {
  const split = customerNumber.split("-");
  if (split.length !== 3) {
    throw new TypeError(
      "The customer number needs to be in the format VV-XXX-C"
    );
  }
  const [isrCode, serialNumber, checkDigit] = split;
  return isrCode + pad(serialNumber, 6) + checkDigit;
}

export interface SlipRequirements {
  readonly slipType: "01" | "04" | "11" | "14" | "21" | "23" | "31" | "33";
  readonly amountFrancsOrEuros: string;
  readonly amountRappenOrCents: string;
  readonly referenceNumber: string;
  readonly customerNumber: string;
}

export function codeLine(req: SlipRequirements): string {
  const paddedAmountFrancsOrEuros = pad(req.amountFrancsOrEuros.toString(), 8);

  const checkDigit1 = checkDigit(
    req.slipType + paddedAmountFrancsOrEuros + req.amountRappenOrCents
  );

  const referenceNumberNoSpaces = req.referenceNumber.replace(/\s/g, "");

  const subscriberNumber = toSubscriberNumber(req.customerNumber);

  return (
    req.slipType +
    paddedAmountFrancsOrEuros +
    req.amountRappenOrCents +
    checkDigit1 +
    AUXILIARY_CHARACTER_1 +
    referenceNumberNoSpaces +
    AUXILIARY_CHARACTER_2 +
    " " +
    subscriberNumber +
    AUXILIARY_CHARACTER_3
  );
}
