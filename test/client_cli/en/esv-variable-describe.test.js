import cp from 'child_process';
import { promisify } from 'util';
import {
  crudeMultilineTakeUntil,
  collapseWhitespace,
  node14Compatibility,
} from '../utils/utils.js';

node14Compatibility();

const exec = promisify(cp.exec);
const CMD = 'frodo esv variable describe --help';
const { stdout } = await exec(CMD);

test("CLI help interface for 'esv variable describe' Usage should be expected english", async () => {
  // Arrange
  const expected = `
  Usage: frodo esv variable describe [options] <host> [realm] [user] [password]
    `.trim();
  // Act
  const testLine = stdout
    .split(/\n/)
    .find((line) => line.trim().startsWith('Usage:'))
    .trim();
  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'esv variable describe' description at line 2 should be expected english", async () => {
  // Arrange
  const expected = `
  Describe variables.
    `.trim();
  // Act
  const testLine = stdout
    .split(/\n/)
    .map((line) => line.trim())
    .at(2);
  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'describe argument host' description should be expected english multiline", async () => {
  // Arrange
  const expected = collapseWhitespace(`
    host                     Access Management base URL, e.g.: https://cdk.iam.example.com/am.
                             To use a connection profile, just specify a unique substring.
    `);
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  host               ',
      '  realm               '
    )
  );

  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'describe argument realm' description should be expected english multiline", async () => {
  // Arrange
  const expected = collapseWhitespace(`
  realm                       Realm. Specify realm as '/' for the root realm or 'realm' or '/parent/child' otherwise. (default:
    "alpha" for Identity Cloud tenants, "/" otherwise.)
    `);
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  realm                    ',
      '  user                     '
    )
  );

  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'describe argument user' description should be expected english multiline", async () => {
  // Arrange
  const expected = collapseWhitespace(`
        user                     Username to login with. Must be an admin user with appropriate
                                 rights to manage authentication journeys/trees.
    `);
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  user                     ',
      '  password                 '
    )
  );

  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'describe argument password' description should be expected english", async () => {
  // Arrange
  const expectedDescription = `
  password                         Password.
    `.trim();
  // Act
  const testLine = stdout
    .split(/\n/)
    .find((line) => line.trim().startsWith('password'))
    .trim();
  // Assert
  expect(testLine).toBe(expectedDescription);
});

test("CLI help interface 'describe option -m, --type <type>' description should be expected english multiline", async () => {
  // Arrange
  const expected = collapseWhitespace(`
    -m, --type <type>        Override auto-detected deployment type. Valid values for type:
                             classic:  A classic Access Management-only deployment with custom
                             layout and configuration.
                             cloud:    A ForgeRock Identity Cloud environment.
                             forgeops: A ForgeOps CDK or CDM deployment.
                             The detected or provided deployment type controls certain
                             behavior like obtaining an Identity Management admin token or not
                             and whether to export/import referenced email templates or how to
                             walk through the tenant admin login flow of Identity Cloud and
                             handle MFA (choices: "classic", "cloud", "forgeops")
    `);
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  -m, --type <type>           ',
      '  -k, --insecure              '
    )
  );

  // Assert
  expect(testLine).toBe(expected);
});

test("CLI help interface 'describe option -i, --variable-id <variable-id>' description should be expected english", async () => {
  // Arrange
  const expectedDescription = `
  -i, --variable-id <variable-id> Variable id.
    `.trim();
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  -i, --variable-id <variable-id>',
      '  -h, --help                  '
    )
  );
  // Assert
  expect(testLine).toBe(expectedDescription);
});

// frodo does not yet export and import of variables
test.skip("CLI help interface 'describe option -f, --file <file>' description should be expected english", async () => {
  // Arrange
  const expectedDescription = `
  -f, --file <file> Name of the file to write the exported journey(s) to. Ignored with -A.
    `.trim();
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  -f, --file <file>           ',
      '  -h, --help                  '
    )
  );

  // Assert
  expect(testLine).toBe(expectedDescription);
});

test("CLI help interface 'describe option -k, --insecure' description should be expected english multiline", async () => {
  // Arrange
  const expected = collapseWhitespace(`
  -k, --insecure              Allow insecure connections when using SSL/TLS. Has no effect when using a network proxy for https
  (HTTPS_PROXY=http://<host>:<port>), in that case the proxy must provide this capability. (default:
  Don't allow insecure connections)
    `);
  // Act
  const testLine = collapseWhitespace(
    crudeMultilineTakeUntil(
      stdout,
      '  -k, --insecure              ',
      '  -i, --variable-id <variable-id>  '
    )
  );

  // Assert
  expect(testLine).toBe(expected);
});

test("'-i, --variable-id <variable-id>' is a mandatory parameter", async () => {
  // Arrange
  const expected = `
  error: required option '-i, --variable-id <variable-id>' not specified
    `.trim();
  // Run command
  expect.assertions(1);
  try {
    const cmd = 'frodo esv variable describe frodo-dev';
    await exec(cmd);
  } catch (error) {
    // Act
    const testLine = error.stderr
      .split(/\n/)
      .find((line) => line.trim().startsWith('error:'))
      .trim();
    // Assert
    expect(testLine).toBe(expected);
  }
});
