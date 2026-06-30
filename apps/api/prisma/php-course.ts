/**
 * Seed data for the "PHP from Zero to Pro" course.
 *
 * Kept as a plain data structure (not inline Prisma `create` calls) so the
 * curriculum is easy to read and edit. `seed.ts` turns this into nested
 * Course → Module → Lesson → Quiz → Question → Option rows.
 *
 * Content uses the lesson Markdown renderer: `#` headings, lists, `inline
 * code`, and ```php fenced code blocks with syntax highlighting. All examples
 * target PHP 8.x semantics (e.g. saner `==`, `match`, named args).
 */

import type { SeedCourse } from './seed-types';

export const phpCourse: SeedCourse = {
  title: 'PHP from Zero to Pro',
  description:
    'A complete, hands-on path through PHP 8 — from your very first echo to objects, exceptions, and talking to a database. Every lesson pairs a worked example with a quick quiz so the ideas stick.',
  modules: [
    /* ===================================================================== */
    {
      title: '1 · Getting Started',
      lessons: [
        {
          title: 'What Is PHP?',
          durationMin: 7,
          content: `**PHP** (a recursive acronym for *PHP: Hypertext Preprocessor*) is a
**server-side** scripting language. The code runs on the web server, and the
browser only ever sees the **output** it produces — usually HTML.

That single idea explains most of what makes PHP feel the way it does:

- It was built to be **embedded in HTML**. A \`.php\` file is HTML until you open a PHP tag.
- It is **interpreted** — there's no separate compile step. Save the file, refresh the page.
- It powers a huge share of the web: WordPress, Laravel, and Wikipedia all run on PHP.

## Opening and closing tags

Anything outside \`<?php ... ?>\` is sent to the browser untouched. Anything
inside is executed as PHP.

\`\`\`php
<!DOCTYPE html>
<html>
<body>
  <h1><?php echo "Hello from the server!"; ?></h1>
</body>
</html>
\`\`\`

The browser never sees the word \`echo\` — only the text \`Hello from the server!\`
that it produced.

> In a file that is **only** PHP (no surrounding HTML), the convention is to
> open with \`<?php\` and **omit** the closing \`?>\` entirely. That avoids
> accidentally sending stray whitespace to the browser.

This course focuses on **PHP 8**, the modern version, whose behaviour is more
predictable than the PHP 5/7 era you may see in older tutorials.`,
          quiz: {
            title: 'What Is PHP? — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Where does PHP code run?',
                options: [
                  { text: 'On the web server, before the page reaches the browser', correct: true },
                  { text: 'In the browser, like JavaScript' },
                  { text: 'On a separate database machine' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does the browser actually receive from a PHP script?',
                options: [
                  { text: 'The output the script produces (e.g. HTML)', correct: true },
                  { text: 'The raw PHP source code' },
                  { text: 'A compiled binary' },
                ],
              },
              {
                type: 'TEXT',
                prompt: 'Which opening tag begins a block of PHP code? (type it exactly)',
                answer: '<?php',
              },
            ],
          },
        },
        {
          title: 'Your First Script: echo, Statements & Comments',
          durationMin: 8,
          content: `The workhorse for producing output is **\`echo\`**. Every statement ends with a
**semicolon** \`;\`.

\`\`\`php
<?php
echo "Hello, world!";
echo "\\n";          // \\n is a newline
echo "Learning PHP.";
\`\`\`

\`echo\` can print several values at once, separated by commas:

\`\`\`php
<?php
echo "a", "b", "c";   // prints: abc
\`\`\`

## print vs echo

\`print\` does almost the same thing but returns the value \`1\`, so it can be used
in an expression. \`echo\` is marginally faster and is what you'll see most often.

## Comments

Comments are ignored by the interpreter. PHP supports three styles:

\`\`\`php
<?php
// single-line comment
# also a single-line comment
/*
   multi-line
   comment
*/
echo "Comments don't print.";
\`\`\`

## Forgetting the semicolon

This is the single most common beginner error. Leaving off a \`;\` produces a
**Parse error** and the page won't run at all:

\`\`\`php
<?php
echo "first"   // <-- missing semicolon!
echo "second";
\`\`\``,
          quiz: {
            title: 'First script — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'Which keyword is most commonly used to output text in PHP?',
                answer: 'echo',
              },
              {
                type: 'TEXT',
                prompt: 'What single character must end (almost) every PHP statement?',
                answer: ';',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does this code print?\n\n```php\n<?php\necho "Code", "Wars";\n```',
                options: [
                  { text: 'CodeWars', correct: true },
                  { text: 'Code Wars' },
                  { text: 'Code, Wars' },
                  { text: 'A parse error' },
                ],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'Which of these start a comment in PHP? (select all that apply)',
                options: [
                  { text: '//', correct: true },
                  { text: '#', correct: true },
                  { text: '/*', correct: true },
                  { text: '<!--' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '2 · Variables & Data Types',
      lessons: [
        {
          title: 'Variables',
          durationMin: 9,
          content: `A **variable** is a named box that holds a value. In PHP every variable name
starts with a dollar sign \`$\`:

\`\`\`php
<?php
$name = "Ada";
$age  = 36;
echo $name;   // Ada
\`\`\`

Rules for names:

- Start with \`$\` followed by a letter or underscore, then letters/digits/underscores.
- Variable names are **case-sensitive**: \`$name\` and \`$Name\` are different boxes.
- PHP is **dynamically typed** — you don't declare a type, and a variable can hold a string now and a number later.

## Inspecting a value with var_dump

\`echo\` shows a value, but \`var_dump()\` shows its **type and value** — invaluable
while learning:

\`\`\`php
<?php
$x = 42;
var_dump($x);      // int(42)
var_dump("42");    // string(2) "42"
var_dump(true);    // bool(true)
\`\`\`

## String interpolation

Inside **double quotes**, a variable name is replaced by its value. Inside
**single quotes** it is not:

\`\`\`php
<?php
$who = "world";
echo "Hello, $who!";   // Hello, world!
echo 'Hello, $who!';   // Hello, $who!
\`\`\``,
          quiz: {
            title: 'Variables — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'What single character must every PHP variable name begin with?',
                answer: '$',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$lang = "PHP";\necho "I love $lang";\n```',
                options: [
                  { text: 'I love PHP', correct: true },
                  { text: 'I love $lang' },
                  { text: 'I love' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Are `$total` and `$Total` the same variable?',
                options: [
                  { text: 'No — variable names are case-sensitive', correct: true },
                  { text: 'Yes — PHP ignores case in variable names' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which function shows both the **type** and value of a variable?',
                options: [
                  { text: 'var_dump()', correct: true },
                  { text: 'echo()' },
                  { text: 'print_type()' },
                ],
              },
            ],
          },
        },
        {
          title: 'Scalar Types: int, float, string, bool',
          durationMin: 10,
          content: `PHP has four **scalar** (single-value) types:

| Type | Example | Notes |
|---|---|---|
| \`int\` | \`42\`, \`-7\` | whole numbers |
| \`float\` | \`3.14\`, \`1.0e3\` | decimals |
| \`string\` | \`"hi"\` | text |
| \`bool\` | \`true\`, \`false\` | logical |

\`\`\`php
<?php
$count   = 10;        // int
$price   = 9.99;      // float
$title   = "Widget";  // string
$inStock = true;      // bool
\`\`\`

## Truthiness

When PHP needs a boolean (e.g. in an \`if\`), these values count as **false**:

- \`false\`, \`0\`, \`0.0\`
- \`""\` (empty string) and \`"0"\`
- \`[]\` (empty array)
- \`null\`

**Everything else is true** — including the string \`"false"\` and \`"0.0"\`!

\`\`\`php
<?php
var_dump((bool) "0");      // bool(false)
var_dump((bool) "false");  // bool(true)  — non-empty string
var_dump((bool) []);       // bool(false)
var_dump((bool) 0.0);      // bool(false)
\`\`\`

## null

\`null\` is the absence of a value. A variable that was never set is also
effectively null (with a warning if you read it).`,
          quiz: {
            title: 'Scalar types — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which type best describes the value `9.99`?',
                options: [
                  { text: 'float', correct: true },
                  { text: 'int' },
                  { text: 'string' },
                  { text: 'bool' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does this print?\n\n```php\n<?php\nvar_dump((bool) "false");\n```',
                options: [{ text: 'bool(true)', correct: true }, { text: 'bool(false)' }],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'Which of these are **falsy** in PHP? (select all that apply)',
                options: [
                  { text: '0', correct: true },
                  { text: '"" (empty string)', correct: true },
                  { text: '[] (empty array)', correct: true },
                  { text: '"0.0"' },
                  { text: '"hello"' },
                ],
              },
            ],
          },
        },
        {
          title: 'Loose Typing: == vs === and Casting',
          durationMin: 10,
          content: `PHP will happily convert between types — *type juggling*. This makes the two
equality operators behave very differently.

- \`==\` — **loose** equality. Converts types, then compares.
- \`===\` — **strict** equality. Values must be equal **and** the same type.

\`\`\`php
<?php
var_dump(5 == "5");    // bool(true)  — string "5" juggled to int 5
var_dump(5 === "5");   // bool(false) — different types
var_dump(1 == true);   // bool(true)
var_dump(0 == false);  // bool(true)
\`\`\`

> **Rule of thumb:** prefer \`===\`. It avoids surprises. Reach for \`==\` only when
> you deliberately want type juggling.

In **PHP 8** the loose rules were made saner. A famous old gotcha,
\`0 == "a"\`, used to be \`true\`; in PHP 8 it is \`false\` because the number is no
longer coerced to 0 — instead the \`0\` is converted to the string \`"0"\`.

\`\`\`php
<?php
var_dump(0 == "a");    // PHP 8: bool(false)   (PHP 7: bool(true)!)
\`\`\`

## Explicit casting

You can force a conversion with a cast in parentheses:

\`\`\`php
<?php
$n = (int) "42abc";   // 42  — parses leading digits
$f = (float) "3.5kg"; // 3.5
$s = (string) 100;    // "100"
$b = (bool) 0;        // false
\`\`\`

## Type-juggling in arithmetic

The \`+\` operator is numeric, so strings are converted to numbers; the \`.\`
operator is for strings, so numbers are converted to text:

\`\`\`php
<?php
echo 5 + "3";   // 8    (numeric context)
echo 5 . "3";   // "53" (string context)
\`\`\``,
          quiz: {
            title: '== vs === — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does this print?\n\n```php\n<?php\nvar_dump(5 === "5");\n```',
                options: [{ text: 'bool(false)', correct: true }, { text: 'bool(true)' }],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'In PHP 8, what is the result of `0 == "a"`?',
                options: [{ text: 'false', correct: true }, { text: 'true' }],
              },
              {
                type: 'NUMBER',
                prompt: 'What number does this print?\n\n```php\n<?php\necho 5 + "3";\n```',
                answer: 8,
              },
              {
                type: 'TEXT',
                prompt: 'What does this print?\n\n```php\n<?php\necho 5 . "3";\n```',
                answer: '53',
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '3 · Operators & Strings',
      lessons: [
        {
          title: 'Operators',
          durationMin: 9,
          content: `## Arithmetic

\`\`\`php
<?php
echo 7 + 2;    // 9
echo 7 - 2;    // 5
echo 7 * 2;    // 14
echo 7 / 2;    // 3.5
echo 7 % 2;    // 1   (modulo — remainder)
echo 7 ** 2;   // 49  (exponent)
echo intdiv(7, 2); // 3 (integer division)
\`\`\`

## Comparison

\`==\`, \`===\`, \`!=\`, \`!==\`, \`<\`, \`>\`, \`<=\`, \`>=\`, and the **spaceship** \`<=>\`,
which returns \`-1\`, \`0\`, or \`1\`:

\`\`\`php
<?php
echo 1 <=> 2;   // -1  (left is smaller)
echo 2 <=> 2;   //  0  (equal)
echo 3 <=> 2;   //  1  (left is larger)
\`\`\`

## Logical

\`&&\` (and), \`||\` (or), \`!\` (not). They **short-circuit**: \`&&\` stops at the
first false, \`||\` stops at the first true.

## Assignment shortcuts

\`\`\`php
<?php
$x = 10;
$x += 5;   // 15
$x -= 3;   // 12
$x *= 2;   // 24
$x .= "!"; // "24!"  (string append)
\`\`\`

## Null coalescing

\`??\` returns the right side if the left is null or undefined — perfect for
defaults without a warning:

\`\`\`php
<?php
$name = $_GET['name'] ?? "guest";
\`\`\``,
          quiz: {
            title: 'Operators — quick check',
            questions: [
              {
                type: 'NUMBER',
                prompt: 'What does this print?\n\n```php\n<?php\necho 17 % 5;\n```',
                answer: 2,
              },
              {
                type: 'NUMBER',
                prompt: 'What does the spaceship print?\n\n```php\n<?php\necho 4 <=> 9;\n```',
                answer: -1,
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does the `??` (null coalescing) operator do?',
                options: [
                  {
                    text: 'Returns the right operand if the left is null or undefined',
                    correct: true,
                  },
                  { text: 'Adds two numbers' },
                  { text: 'Compares two values and returns -1, 0, or 1' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'What does `$x` hold at the end?\n\n```php\n<?php\n$x = "5";\n$x .= "5";\necho $x;\n```',
                answer: '55',
              },
            ],
          },
        },
        {
          title: 'Working with Strings',
          durationMin: 11,
          content: `## Concatenation

The dot \`.\` joins strings (PHP does **not** use \`+\` for this):

\`\`\`php
<?php
$first = "Grace";
$last  = "Hopper";
echo $first . " " . $last;   // Grace Hopper
\`\`\`

## Single vs double quotes

- **Double quotes** interpolate variables and interpret escapes like \`\\n\` and \`\\t\`.
- **Single quotes** are literal (only \`\\'\` and \`\\\\\` are special).

\`\`\`php
<?php
$name = "Sam";
echo "Hi $name\\n";   // Hi Sam  + newline
echo 'Hi $name\\n';   // Hi $name\\n  (literal)
\`\`\`

For complex interpolation, wrap the expression in braces:

\`\`\`php
<?php
$user = ["name" => "Lin"];
echo "Hello {$user['name']}";   // Hello Lin
\`\`\`

## Handy string functions

\`\`\`php
<?php
echo strlen("hello");          // 5   length
echo strtoupper("hi");         // HI
echo strtolower("HI");         // hi
echo ucfirst("php");           // Php
echo str_replace("a", "4", "banana"); // b4n4n4
echo trim("  hi  ");           // "hi"
echo substr("abcdef", 1, 3);   // bcd
echo str_repeat("ab", 3);      // ababab
var_dump(str_contains("haystack", "st")); // bool(true)
\`\`\`

Remember: PHP string positions are **0-indexed**, so \`substr("abcdef", 1, 3)\`
starts at the character \`b\`.`,
          quiz: {
            title: 'Strings — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'Which single character is the string concatenation operator in PHP?',
                answer: '.',
              },
              {
                type: 'NUMBER',
                prompt: 'What does this print?\n\n```php\n<?php\necho strlen("PHP rocks");\n```',
                answer: 9,
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$x = "PHP";\necho \'Value: $x\';\n```',
                options: [
                  { text: 'Value: $x', correct: true },
                  { text: 'Value: PHP' },
                  { text: 'Value:' },
                ],
              },
              {
                type: 'TEXT',
                prompt: 'What does this print?\n\n```php\n<?php\necho substr("abcdef", 1, 3);\n```',
                answer: 'bcd',
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '4 · Control Flow',
      lessons: [
        {
          title: 'if / elseif / else and the Ternary',
          durationMin: 9,
          content: `\`\`\`php
<?php
$score = 82;

if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} elseif ($score >= 70) {
    echo "C";
} else {
    echo "F";
}
// prints: B
\`\`\`

The condition in the parentheses is evaluated for **truthiness** (recall the
falsy values from Module 2).

## The ternary operator

A compact \`if/else\` that **returns a value**:

\`\`\`php
<?php
$age = 20;
$label = $age >= 18 ? "adult" : "minor";
echo $label;   // adult
\`\`\`

## Short ternary and null coalescing

\`\`\`php
<?php
$name = "" ?: "anonymous";        // "anonymous"  (?: uses left if truthy)
$city = $config['city'] ?? "N/A"; // "N/A" if key missing/null
\`\`\`

The difference: \`?:\` checks **truthiness**, \`??\` checks only for **null /
undefined** (and won't warn on a missing key).`,
          quiz: {
            title: 'Conditionals — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$n = 7;\nif ($n % 2 === 0) {\n    echo "even";\n} else {\n    echo "odd";\n}\n```',
                options: [{ text: 'odd', correct: true }, { text: 'even' }],
              },
              {
                type: 'TEXT',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$age = 16;\necho $age >= 18 ? "adult" : "minor";\n```',
                answer: 'minor',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Which operator returns the right side only when the left side is **null or undefined**?',
                options: [{ text: '??', correct: true }, { text: '?:' }, { text: '<=>' }],
              },
            ],
          },
        },
        {
          title: 'switch and match',
          durationMin: 9,
          content: `## switch

\`switch\` compares a value against several \`case\`s using **loose** \`==\`. Don't
forget \`break\`, or execution *falls through* to the next case:

\`\`\`php
<?php
$role = "editor";

switch ($role) {
    case "admin":
        echo "Full access";
        break;
    case "editor":
        echo "Can edit";
        break;
    default:
        echo "Read only";
}
// prints: Can edit
\`\`\`

## match (PHP 8)

\`match\` is the modern alternative. It:

- uses **strict** \`===\` comparison,
- **returns a value**,
- needs no \`break\` (no fall-through),
- throws if nothing matches (no silent miss).

\`\`\`php
<?php
$status = 404;

$message = match ($status) {
    200, 201 => "OK",
    404      => "Not Found",
    500      => "Server Error",
    default  => "Unknown",
};
echo $message;   // Not Found
\`\`\`

Because \`match\` is strict, \`match("1")\` will **not** match the integer case \`1\`.`,
          quiz: {
            title: 'switch / match — quick check',
            questions: [
              {
                type: 'MULTIPLE_CHOICE',
                prompt: 'How does `match` differ from `switch`? (select all that apply)',
                options: [
                  { text: 'It uses strict === comparison', correct: true },
                  { text: 'It returns a value', correct: true },
                  { text: 'It has no fall-through (no break needed)', correct: true },
                  { text: 'It silently does nothing when no case matches' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$n = 2;\necho match ($n) {\n    1 => "one",\n    2 => "two",\n    default => "many",\n};\n```',
                options: [{ text: 'two', correct: true }, { text: 'one' }, { text: 'many' }],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'In a `switch`, what happens if you forget `break` at the end of a matched case?',
                options: [
                  { text: 'Execution falls through into the next case', correct: true },
                  { text: 'A parse error is thrown' },
                  { text: 'Nothing — break is optional and implied' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '5 · Loops',
      lessons: [
        {
          title: 'while and do-while',
          durationMin: 8,
          content: `A \`while\` loop repeats **as long as** its condition is true. The condition is
checked **before** each pass, so the body may run zero times.

\`\`\`php
<?php
$i = 1;
while ($i <= 3) {
    echo $i;     // 123
    $i++;        // don't forget to advance — or it loops forever!
}
\`\`\`

## do-while

A \`do-while\` checks the condition **after** the body, so it always runs **at
least once**:

\`\`\`php
<?php
$i = 10;
do {
    echo $i;     // 10  (runs once even though 10 > 3)
} while ($i <= 3);
\`\`\`

## break and continue

- \`break\` exits the loop entirely.
- \`continue\` skips to the next iteration.

\`\`\`php
<?php
$i = 0;
while (true) {
    $i++;
    if ($i === 3) continue; // skip printing 3
    if ($i > 5)  break;     // stop after 5
    echo $i;                // 1245
}
\`\`\``,
          quiz: {
            title: 'while — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$i = 1;\nwhile ($i <= 4) {\n    echo $i;\n    $i++;\n}\n```',
                answer: '1234',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'How many times does the body of a `do-while` loop run, at minimum?',
                options: [
                  { text: 'At least once', correct: true },
                  { text: 'Zero times' },
                  { text: 'Exactly twice' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does `continue` do inside a loop?',
                options: [
                  { text: 'Skips the rest of the current iteration', correct: true },
                  { text: 'Exits the loop completely' },
                  { text: 'Restarts the whole program' },
                ],
              },
            ],
          },
        },
        {
          title: 'for and foreach',
          durationMin: 10,
          content: `A \`for\` loop bundles the counter setup, condition, and step into one line:

\`\`\`php
<?php
for ($i = 0; $i < 5; $i++) {
    echo $i;   // 01234
}
\`\`\`

The three parts are: **init**; **condition**; **step**.

## foreach — the array workhorse

\`foreach\` is the idiomatic way to walk an array. You'll use it constantly.

\`\`\`php
<?php
$colors = ["red", "green", "blue"];

foreach ($colors as $color) {
    echo $color . " ";   // red green blue
}
\`\`\`

To get the **key** as well (essential for associative arrays):

\`\`\`php
<?php
$ages = ["Ada" => 36, "Linus" => 54];

foreach ($ages as $name => $age) {
    echo "$name is $age\\n";
}
// Ada is 36
// Linus is 54
\`\`\`

> Use \`for\` when you need a numeric counter; reach for \`foreach\` whenever you're
> iterating the contents of an array.`,
          quiz: {
            title: 'for / foreach — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt:
                  'What does this print?\n\n```php\n<?php\nfor ($i = 1; $i <= 3; $i++) {\n    echo $i;\n}\n```',
                answer: '123',
              },
              {
                type: 'NUMBER',
                prompt:
                  'How many times does this loop body execute?\n\n```php\n<?php\nfor ($i = 0; $i < 5; $i++) {\n    // body\n}\n```',
                answer: 5,
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which form gives you both the key and the value of each array element?',
                options: [
                  { text: 'foreach ($arr as $key => $value)', correct: true },
                  { text: 'foreach ($arr as $value)' },
                  { text: 'for ($arr as $key)' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '6 · Functions',
      lessons: [
        {
          title: 'Defining and Calling Functions',
          durationMin: 10,
          content: `A function packages reusable logic. Define it with \`function\`, call it by name:

\`\`\`php
<?php
function greet($name) {
    return "Hello, $name!";
}

echo greet("Ada");   // Hello, Ada!
\`\`\`

- **Parameters** are the names in the definition (\`$name\`).
- **Arguments** are the values you pass in (\`"Ada"\`).
- \`return\` hands a value back to the caller and ends the function. With no
  \`return\`, a function yields \`null\`.

## Default parameter values

\`\`\`php
<?php
function greet($name = "guest") {
    return "Hi, $name";
}
echo greet();        // Hi, guest
echo greet("Sam");   // Hi, Sam
\`\`\`

## Type declarations

PHP lets you declare parameter and return types. They make bugs surface early:

\`\`\`php
<?php
function add(int $a, int $b): int {
    return $a + $b;
}
echo add(2, 3);   // 5
\`\`\`

## Named arguments (PHP 8)

You can pass arguments by name, in any order — great for skipping optional ones:

\`\`\`php
<?php
function makeCoffee(string $type, bool $decaf = false, int $sugars = 0) {
    return "$type, decaf=" . ($decaf ? "yes" : "no") . ", sugars=$sugars";
}
echo makeCoffee("latte", sugars: 2);   // latte, decaf=no, sugars=2
\`\`\``,
          quiz: {
            title: 'Functions — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'Which keyword defines a function in PHP?',
                answer: 'function',
              },
              {
                type: 'TEXT',
                prompt: 'Which keyword sends a value back from a function to its caller?',
                answer: 'return',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\nfunction double($n) {\n    return $n * 2;\n}\necho double(double(3));\n```',
                options: [{ text: '12', correct: true }, { text: '6' }, { text: '9' }],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does a function return if it has no `return` statement?',
                options: [
                  { text: 'null', correct: true },
                  { text: '0' },
                  { text: 'An empty string' },
                ],
              },
            ],
          },
        },
        {
          title: 'Scope, References & Arrow Functions',
          durationMin: 11,
          content: `A variable created inside a function is **local** — it doesn't leak out, and
the function can't see outer variables unless you pass them in:

\`\`\`php
<?php
$x = 10;

function show() {
    echo $x ?? "undefined";   // undefined — $x isn't visible here
}
show();
\`\`\`

## Passing by reference

Normally arguments are passed **by value** (a copy). Prefix the parameter with
\`&\` to let the function modify the caller's variable:

\`\`\`php
<?php
function addOne(&$n) {
    $n++;
}
$count = 5;
addOne($count);
echo $count;   // 6
\`\`\`

## Closures and arrow functions

A **closure** is a function stored in a variable. An **arrow function**
(\`fn\`, PHP 7.4+) is a compact closure that automatically captures outer
variables:

\`\`\`php
<?php
$factor = 3;

$triple = fn($n) => $n * $factor;   // captures $factor automatically
echo $triple(5);   // 15
\`\`\`

These shine with array functions:

\`\`\`php
<?php
$nums    = [1, 2, 3, 4];
$squares = array_map(fn($n) => $n ** 2, $nums);
print_r($squares);   // [1, 4, 9, 16]
\`\`\``,
          quiz: {
            title: 'Scope & closures — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\nfunction inc(&$n) {\n    $n++;\n}\n$v = 9;\ninc($v);\necho $v;\n```',
                options: [{ text: '10', correct: true }, { text: '9' }, { text: 'null' }],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'By default, how are arguments passed to a PHP function?',
                options: [
                  { text: 'By value (a copy)', correct: true },
                  { text: 'By reference (the original)' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$base = 10;\n$add = fn($n) => $n + $base;\necho $add(5);\n```',
                options: [
                  { text: '15', correct: true },
                  { text: '5' },
                  { text: 'An error — $base is out of scope' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '7 · Arrays',
      lessons: [
        {
          title: 'Indexed & Associative Arrays',
          durationMin: 10,
          content: `An array holds many values in one variable. PHP arrays are flexible — they can
be a simple list **or** a key/value map.

## Indexed arrays

Keys are integers starting at **0**:

\`\`\`php
<?php
$fruits = ["apple", "banana", "cherry"];
echo $fruits[0];   // apple
echo $fruits[2];   // cherry

$fruits[] = "date"; // append to the end
echo count($fruits); // 4
\`\`\`

## Associative arrays

You choose string keys — ideal for records:

\`\`\`php
<?php
$user = [
    "name"  => "Ada",
    "email" => "ada@example.com",
    "admin" => true,
];
echo $user["name"];   // Ada
$user["age"] = 36;    // add a new pair
\`\`\`

## Nested arrays

Values can themselves be arrays:

\`\`\`php
<?php
$team = [
    ["name" => "Ada",   "role" => "lead"],
    ["name" => "Linus", "role" => "dev"],
];
echo $team[1]["name"];   // Linus
\`\`\`

Use \`print_r($array)\` or \`var_dump($array)\` to inspect an array's structure
while debugging.`,
          quiz: {
            title: 'Arrays — quick check',
            questions: [
              {
                type: 'NUMBER',
                prompt:
                  'What index holds `"banana"`?\n\n```php\n<?php\n$fruits = ["apple", "banana", "cherry"];\n```',
                answer: 1,
              },
              {
                type: 'NUMBER',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$a = [10, 20, 30];\n$a[] = 40;\necho count($a);\n```',
                answer: 4,
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$user = ["name" => "Ada", "age" => 36];\necho $user["age"];\n```',
                options: [{ text: '36', correct: true }, { text: 'age' }, { text: 'Ada' }],
              },
            ],
          },
        },
        {
          title: 'Essential Array Functions',
          durationMin: 11,
          content: `PHP ships hundreds of array helpers. These are the ones you'll reach for daily.

## Inspecting & searching

\`\`\`php
<?php
$nums = [3, 1, 4, 1, 5];
echo count($nums);            // 5
var_dump(in_array(4, $nums)); // bool(true)
echo array_search(4, $nums);  // 2  (the index)
\`\`\`

## Transforming

\`\`\`php
<?php
$nums = [1, 2, 3, 4];

$doubled = array_map(fn($n) => $n * 2, $nums);   // [2, 4, 6, 8]
$evens   = array_filter($nums, fn($n) => $n % 2 === 0); // [2, 4]
$total   = array_reduce($nums, fn($carry, $n) => $carry + $n, 0); // 10
\`\`\`

- \`array_map\` — transform every element.
- \`array_filter\` — keep elements that pass a test.
- \`array_reduce\` — boil the array down to a single value.

## Sorting

\`\`\`php
<?php
$nums = [3, 1, 2];
sort($nums);     // [1, 2, 3]  — modifies in place, returns bool
rsort($nums);    // [3, 2, 1]

$ages = ["Ada" => 36, "Sam" => 20];
asort($ages);    // sort by value, keep keys
ksort($ages);    // sort by key
\`\`\`

## Joining & splitting

\`\`\`php
<?php
echo implode(", ", ["a", "b", "c"]); // "a, b, c"
print_r(explode("-", "2024-01-15")); // ["2024", "01", "15"]
\`\`\`

> Watch out: \`sort()\` and friends modify the array **in place** and return a
> boolean — not the sorted array. \`array_map\`/\`array_filter\` instead **return**
> a new array.`,
          quiz: {
            title: 'Array functions — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which function keeps only the elements that pass a test?',
                options: [
                  { text: 'array_filter', correct: true },
                  { text: 'array_map' },
                  { text: 'implode' },
                ],
              },
              {
                type: 'NUMBER',
                prompt:
                  'What does this print?\n\n```php\n<?php\n$nums = [1, 2, 3, 4];\n$r = array_reduce($nums, fn($c, $n) => $c + $n, 0);\necho $r;\n```',
                answer: 10,
              },
              {
                type: 'TEXT',
                prompt:
                  'What does this print?\n\n```php\n<?php\necho implode("-", ["a", "b", "c"]);\n```',
                answer: 'a-b-c',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does `sort($arr)` return?',
                options: [
                  { text: 'A boolean — it sorts $arr in place', correct: true },
                  { text: 'A new, sorted copy of the array' },
                  { text: 'The number of elements sorted' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '8 · Object-Oriented PHP',
      lessons: [
        {
          title: 'Classes, Objects & $this',
          durationMin: 12,
          content: `A **class** is a blueprint; an **object** is an instance built from it.

\`\`\`php
<?php
class Dog {
    public string $name;

    public function bark(): string {
        return "{$this->name} says woof!";
    }
}

$rex = new Dog();        // create an instance
$rex->name = "Rex";      // set a property with ->
echo $rex->bark();       // Rex says woof!
\`\`\`

- **Properties** are variables that belong to an object (\`$name\`).
- **Methods** are functions that belong to an object (\`bark()\`).
- Inside a method, \`$this\` refers to the current object. Note: you write
  \`$this->name\`, **not** \`$this->$name\`.

## The constructor

\`__construct\` runs automatically when you create an object — the place to set
things up:

\`\`\`php
<?php
class Point {
    public function __construct(
        public int $x,
        public int $y,
    ) {}
}

$p = new Point(3, 4);
echo "$p->x, $p->y";   // 3, 4
\`\`\`

That \`public int $x\` in the constructor is **constructor property promotion**
(PHP 8): it declares **and** assigns the property in one step, instead of
writing \`$this->x = $x;\` by hand.`,
          quiz: {
            title: 'Classes — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'Which keyword creates a new object from a class?',
                answer: 'new',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Inside a method, how do you refer to the current object’s `name` property?',
                options: [
                  { text: '$this->name', correct: true },
                  { text: '$this->$name' },
                  { text: 'this.name' },
                  { text: '$name' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'What is the name of the special method that runs automatically when an object is created? (include the leading underscores)',
                answer: '__construct',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\nclass Counter {\n    public int $count = 0;\n    public function inc(): void {\n        $this->count++;\n    }\n}\n$c = new Counter();\n$c->inc();\n$c->inc();\necho $c->count;\n```',
                options: [{ text: '2', correct: true }, { text: '0' }, { text: '1' }],
              },
            ],
          },
        },
        {
          title: 'Encapsulation, Inheritance & Interfaces',
          durationMin: 13,
          content: `## Encapsulation: visibility

Visibility keywords control who can touch a property or method:

- \`public\` — accessible anywhere.
- \`protected\` — only this class and its subclasses.
- \`private\` — only this class.

\`\`\`php
<?php
class BankAccount {
    private int $balance = 0;

    public function deposit(int $amount): void {
        if ($amount > 0) $this->balance += $amount;
    }
    public function getBalance(): int {
        return $this->balance;
    }
}

$acc = new BankAccount();
$acc->deposit(100);
echo $acc->getBalance();   // 100
// $acc->balance = 999;    // Error: cannot access private property
\`\`\`

## Inheritance

A subclass \`extends\` a parent, reusing and overriding behaviour. \`parent::\`
calls the parent's version:

\`\`\`php
<?php
class Animal {
    public function speak(): string { return "..."; }
}
class Cat extends Animal {
    public function speak(): string { return "Meow"; }
}

echo (new Cat())->speak();   // Meow
\`\`\`

## Interfaces

An **interface** is a contract — a list of methods a class promises to provide.
A class \`implements\` it:

\`\`\`php
<?php
interface Shape {
    public function area(): float;
}

class Circle implements Shape {
    public function __construct(private float $r) {}
    public function area(): float {
        return 3.14159 * $this->r ** 2;
    }
}

echo (new Circle(2))->area();   // 12.56636
\`\`\`

Interfaces let unrelated classes be used interchangeably as long as they fulfil
the contract — the foundation of flexible, testable code.`,
          quiz: {
            title: 'OOP pillars — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Which visibility keyword makes a property accessible **only within the same class**?',
                options: [
                  { text: 'private', correct: true },
                  { text: 'protected' },
                  { text: 'public' },
                ],
              },
              {
                type: 'TEXT',
                prompt: 'Which keyword makes one class inherit from another?',
                answer: 'extends',
              },
              {
                type: 'TEXT',
                prompt: 'Which keyword makes a class fulfil an interface contract?',
                answer: 'implements',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\nclass A {\n    public function hi(): string { return "A"; }\n}\nclass B extends A {\n    public function hi(): string { return "B" . parent::hi(); }\n}\necho (new B())->hi();\n```',
                options: [
                  { text: 'BA', correct: true },
                  { text: 'B' },
                  { text: 'AB' },
                  { text: 'A' },
                ],
              },
            ],
          },
        },
      ],
    },
    /* ===================================================================== */
    {
      title: '9 · Going Pro',
      lessons: [
        {
          title: 'Errors & Exceptions',
          durationMin: 11,
          content: `Modern PHP signals serious problems by **throwing** an exception — an object
that interrupts normal flow. You handle it with \`try\` / \`catch\`:

\`\`\`php
<?php
function divide(int $a, int $b): float {
    if ($b === 0) {
        throw new InvalidArgumentException("Cannot divide by zero");
    }
    return $a / $b;
}

try {
    echo divide(10, 0);
} catch (InvalidArgumentException $e) {
    echo "Error: " . $e->getMessage();
}
// Error: Cannot divide by zero
\`\`\`

The flow:

1. Code in \`try\` runs until something throws.
2. The matching \`catch\` block handles the exception by type.
3. An optional \`finally\` block runs **either way** — perfect for cleanup.

\`\`\`php
<?php
try {
    risky();
} catch (Exception $e) {
    echo "Handled";
} finally {
    echo " — always runs";
}
\`\`\`

## Throwing your own

You can define custom exception types by extending \`Exception\`, and catch
specific ones before more general ones:

\`\`\`php
<?php
class PaymentException extends Exception {}

try {
    throw new PaymentException("Card declined");
} catch (PaymentException $e) {
    echo $e->getMessage();   // Card declined
}
\`\`\`

> An **uncaught** exception is fatal: it stops the script. Catch the ones you
> can recover from, and let the rest surface loudly during development.`,
          quiz: {
            title: 'Exceptions — quick check',
            questions: [
              {
                type: 'TEXT',
                prompt: 'Which keyword raises (signals) an exception?',
                answer: 'throw',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Which block runs whether or not an exception was thrown?',
                options: [
                  { text: 'finally', correct: true },
                  { text: 'catch' },
                  { text: 'default' },
                  { text: 'else' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'What does this print?\n\n```php\n<?php\ntry {\n    throw new Exception("boom");\n    echo "after throw";\n} catch (Exception $e) {\n    echo "caught: " . $e->getMessage();\n}\n```',
                options: [
                  { text: 'caught: boom', correct: true },
                  { text: 'after throwcaught: boom' },
                  { text: 'boom' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What happens to an exception that is never caught?',
                options: [
                  { text: 'It becomes a fatal error and stops the script', correct: true },
                  { text: 'It is silently ignored' },
                  { text: 'It is automatically retried' },
                ],
              },
            ],
          },
        },
        {
          title: 'Namespaces, Composer & Autoloading',
          durationMin: 10,
          content: `## Namespaces

As projects grow, two libraries might both define a \`Logger\` class.
**Namespaces** prevent the collision by grouping names:

\`\`\`php
<?php
namespace App\\Billing;

class Invoice {
    public function total(): int { return 100; }
}
\`\`\`

To use it from elsewhere, refer to the full name or \`use\` it:

\`\`\`php
<?php
use App\\Billing\\Invoice;

$inv = new Invoice();
echo $inv->total();   // 100
\`\`\`

## Composer: the package manager

**Composer** is PHP's dependency manager (like npm for Node). You declare
dependencies in \`composer.json\` and run \`composer install\`:

\`\`\`bash
composer require guzzlehttp/guzzle
\`\`\`

## Autoloading

Instead of \`require\`-ing every file by hand, Composer generates an
**autoloader** that maps namespaces to files (the **PSR-4** standard). You
include it once:

\`\`\`php
<?php
require "vendor/autoload.php";

use App\\Billing\\Invoice;   // class file loaded automatically on first use
\`\`\`

After that, referencing any class loads its file on demand — no manual
\`require\` per class.`,
          quiz: {
            title: 'Namespaces & Composer — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What problem do namespaces primarily solve?',
                options: [
                  { text: 'Naming collisions between classes/functions', correct: true },
                  { text: 'Slow array sorting' },
                  { text: 'Database connection pooling' },
                ],
              },
              {
                type: 'TEXT',
                prompt: "What is the name of PHP's standard dependency manager?",
                answer: 'composer',
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does an autoloader let you avoid?',
                options: [
                  { text: 'Manually `require`-ing a file for every class you use', correct: true },
                  { text: 'Writing any classes at all' },
                  { text: 'Using namespaces' },
                ],
              },
              {
                type: 'TEXT',
                prompt:
                  'Which keyword imports a class from another namespace so you can use its short name?',
                answer: 'use',
              },
            ],
          },
        },
        {
          title: 'Talking to a Database with PDO',
          durationMin: 12,
          content: `**PDO** (PHP Data Objects) is the modern, database-agnostic way to run SQL from
PHP. The same code works against MySQL, PostgreSQL, SQLite, and more.

## Connecting

\`\`\`php
<?php
$pdo = new PDO(
    "mysql:host=localhost;dbname=shop;charset=utf8mb4",
    "user",
    "password",
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
\`\`\`

Setting the error mode to **exceptions** means failed queries throw (catchable
with the \`try/catch\` you just learned) instead of failing silently.

## Prepared statements — never concatenate user input

The cardinal rule: **never** build SQL by gluing in user input. That's how SQL
injection happens. Use **placeholders** and let PDO bind the values safely:

\`\`\`php
<?php
// DANGER — never do this:
// $pdo->query("SELECT * FROM users WHERE email = '$email'");

// Safe: a prepared statement with a bound parameter
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
\`\`\`

Named placeholders read more clearly for several values:

\`\`\`php
<?php
$stmt = $pdo->prepare(
    "INSERT INTO users (name, email) VALUES (:name, :email)"
);
$stmt->execute([
    ":name"  => "Ada",
    ":email" => "ada@example.com",
]);
\`\`\`

## Fetching results

\`\`\`php
<?php
$stmt = $pdo->query("SELECT id, name FROM users");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);  // array of associative arrays

foreach ($rows as $row) {
    echo "{$row['id']}: {$row['name']}\\n";
}
\`\`\`

> Prepared statements are the **single most important security habit** in PHP.
> If you remember one thing from this module, remember: bind, don't concatenate.`,
          quiz: {
            title: 'PDO — quick check',
            questions: [
              {
                type: 'SINGLE_CHOICE',
                prompt: 'What does PDO stand for?',
                options: [
                  { text: 'PHP Data Objects', correct: true },
                  { text: 'Prepared Database Operations' },
                  { text: 'PHP Database Output' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt: 'Why should you use prepared statements with bound parameters?',
                options: [
                  { text: 'They prevent SQL injection from untrusted input', correct: true },
                  { text: 'They make the database run without a server' },
                  { text: 'They are required to connect to MySQL' },
                ],
              },
              {
                type: 'MULTIPLE_CHOICE',
                prompt:
                  'Which are valid placeholders in a PDO prepared statement? (select all that apply)',
                options: [
                  { text: '? (positional)', correct: true },
                  { text: ':name (named)', correct: true },
                  { text: '$name (a PHP variable inside the SQL string)' },
                ],
              },
              {
                type: 'SINGLE_CHOICE',
                prompt:
                  'Setting `PDO::ATTR_ERRMODE` to `PDO::ERRMODE_EXCEPTION` causes failed queries to…',
                options: [
                  { text: 'throw an exception you can catch', correct: true },
                  { text: 'retry automatically' },
                  { text: 'be ignored silently' },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};
