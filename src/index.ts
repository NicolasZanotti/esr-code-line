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

export const pad = (s: string, n: number): string =>
  (s.length < n ? "0".repeat(n - s.length) : "") + s;

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

export function codeLine(
  slipType: "01" | "04" | "11" | "14" | "21" | "23" | "31" | "33",
  amountFrancsOrEuros: string,
  amountRappenOrCents: string,
  referenceNumber: string,
  customerNumber: string
): string {
  const paddedAmountFrancsOrEuros = pad(amountFrancsOrEuros, 8);

  const checkDigit1 = checkDigit(
    slipType + paddedAmountFrancsOrEuros + amountRappenOrCents
  );

  const referenceNumberWithoutWhiteSpace = referenceNumber.replace(/\s/g, "");

  const subscriberNumber = toSubscriberNumber(customerNumber);

  return (
    slipType +
    paddedAmountFrancsOrEuros +
    amountRappenOrCents +
    checkDigit1 +
    AUXILIARY_CHARACTER_1 +
    referenceNumberWithoutWhiteSpace +
    AUXILIARY_CHARACTER_2 +
    " " +
    subscriberNumber +
    AUXILIARY_CHARACTER_3
  );
}
