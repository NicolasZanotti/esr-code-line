import {
  codeLine,
  checkDigit,
  attachCheckDigit,
  toSubscriberNumber,
  pad,
} from "./index";

test("Pads prices in CHF to the left with zeros.", () => {
  const codeRequiresPadding = pad("1", 8);
  expect(codeRequiresPadding).toBe("00000001");

  const codeExactRequiredLength = pad("12345678", 8);
  expect(codeExactRequiredLength).toBe("12345678");

  const codeOverRequiredLength = pad("0123456789", 8);
  expect(codeOverRequiredLength).toBe("0123456789");
});

test("Transforms a customer number to the code line value.", () => {
  // Value take from ISR Manual p. 24
  const r1 = toSubscriberNumber("01-162-8");
  expect(r1).toBe("010001628");

  const r2 = toSubscriberNumber("03-162-5");
  expect(r2).toBe("030001625");

  expect(() => {
    toSubscriberNumber("010001628");
  }).toThrow(TypeError);
});

test("Computes valid check digits.", () => {
  // Values taken from ISR Manual p. 26
  const shortCode = checkDigit("31");
  expect(shortCode).toBe(9);

  const shortCodeLeadingZero = checkDigit("04");
  expect(shortCodeLeadingZero).toBe(2);

  const longCode = checkDigit("210000044000");
  expect(longCode).toBe(1);

  const longCodeLeadingZero = checkDigit("010000394975");
  expect(longCodeLeadingZero).toBe(3);

  // Helper function
  const attachedCheckDigit = attachCheckDigit("04");
  expect(attachedCheckDigit).toBe("042");
});

test("Contains a valid check digit in the correct spot.", () => {
  // Values taken from ISR Manual p. 25
  const result = codeLine(
    "01",
    "3949",
    "75",
    "12 00000 00000 23447 89432 16899",
    "01-162-8"
  );

  // check digit of slip type and amount is 3
  expect(result).toContain("0100003949753");
});

test("Assembles code in the correct order.", () => {
  const result = codeLine(
    "01",
    "3949",
    "75",
    "12 00000 00000 23447 89432 16899",
    "01-162-8"
  );
  expect(result).toBe("0100003949753>120000000000234478943216899+ 010001628>");
});
