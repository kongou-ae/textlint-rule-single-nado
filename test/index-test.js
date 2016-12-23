"use strict";
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();

// rule
const rule = require("../src/index");
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        "スパゲッティやオムライス等の洋食はいかがですか。",
        "スパゲッティとオムライス、ビーフシチュー等の洋食はいかがですか"
    ],
    invalid: [
        {
            text: "オムライス等の洋食はいかがですか。それともごはん等の和食はいかがですか。",
            errors: [
                {
                    message: "「など」「等」を使う場合は、2つ以上の具体例を挙げます。",
                },
                {
                    message: "「など」「等」を使う場合は、2つ以上の具体例を挙げます。",
                }
            ]
        },
    ]
});