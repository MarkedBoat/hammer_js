var chars = {
    "a": {
        "width": 5,
        "lines": [
            "  _",
            " /_\\",
            "/   \\"
        ]
    },
    "b": {
        "width": 4,
        "lines": [
            "___",
            "|__)",
            "|__)"
        ]
    },
    "c": {
        "width": 4,
        "lines": [
            " ___",
            "/",
            "\\__ "
        ]
    },
    "d": {
        "width": 5,
        "lines": [
            "___",
            "|  \\",
            "|__/"
        ]
    },
    "e": {
        "width": 5,
        "lines": [
            "____",
            "|___",
            "|___"
        ]
    },
    "f": {
        "width": 5,
        "lines": [
            "____",
            "|___",
            "|"
        ]
    },
    "g": {
        "width": 5,
        "lines": [
            "____",
            "| __",
            "|__]"
        ]
    },
    "h": {
        "width": 5,
        "lines": [
            "_  _",
            "|__|",
            "|  |"
        ]
    },
    "i": {
        "width": 1,
        "lines": [
            "_",
            "|",
            "|"
        ]
    },
    "j": {
        "width": 3,
        "lines": [
            "___",
            " |",
            "_/"
        ]
    },
    "k": {
        "width": 4,
        "lines": [
            "_  _",
            "|_/",
            "| \\_"
        ]
    },
    "l": {
        "width": 5,
        "lines": [
            "_",
            "|",
            "|___"
        ]
    },
    "m": {
        "width": 5,
        "lines": [
            "_  _",
            "|\\/|",
            "|  |"
        ]
    },
    "n": {
        "width": 5,
        "lines": [
            "_  _",
            "|\\ |",
            "| \\|"
        ]
    },
    "o": {
        "width": 5,
        "lines": [
            "____",
            "|  |",
            "|__|"
        ]
    },
    "p": {
        "width": 5,
        "lines": [
            "___",
            "|__]",
            "|"
        ]
    },
    "q": {
        "width": 5,
        "lines": [
            "____",
            "|  |",
            "|_\\|"
        ]
    },
    "r": {
        "width": 5,
        "lines": [
            "____",
            "|__/",
            "|  \\"
        ]
    },
    "s": {
        "width": 4,
        "lines": [
            " ___",
            "(__",
            "___)"
        ]
    },
    "t": {
        "width": 3,
        "lines": [
            "___",
            " |",
            " |"
        ]
    },
    "u": {
        "width": 5,
        "lines": [
            "_  _",
            "|  |",
            "|_/|"
        ]
    },
    "v": {
        "width": 5,
        "lines": [
            "_  _",
            "|  |",
            " \\/"
        ]
    },
    "w": {
        "width": 5,
        "lines": [
            "_ _ _",
            "| | |",
            "\\/ \\/"
        ]
    },
    "x": {
        "width": 5,
        "lines": [
            "_  _",
            " \\/",
            "_/\\_"
        ]
    },
    "y": {
        "width": 5,
        "lines": [
            "_   _",
            " \\_/",
            "  |"
        ]
    },
    "z": {
        "width": 5,
        "lines": [
            "___",
            "  /",
            " /__"
        ]
    },
    "1": {
        "width": 5,
        "lines": [
            "  /|",
            "   |",
            "   |"
        ]
    },
    "2": {
        "width": 5,
        "lines": [
            "---.",
            " __/",
            "|___"
        ]
    },
    "3": {
        "width": 5,
        "lines": [
            "---.",
            "___|",
            "___|"
        ]
    },
    "4": {
        "width": 5,
        "lines": [
            " / |",
            "/__|",
            "   |"
        ]
    },
    "5": {
        "width": 5,
        "lines": [
            ".---",
            "|__.",
            "___|"
        ]
    },
    "6": {
        "width": 5,
        "lines": [
            "|",
            "|__.",
            "|__|"
        ]
    },
    "7": {
        "width": 5,
        "lines": [
            "---.",
            "  / ",
            " /  "
        ]
    },
    "8": {
        "width": 5,
        "lines": [
            ".--.",
            "|__|",
            "|__|"
        ]
    },
    "9": {
        "width": 5,
        "lines": [
            ".--.",
            "|__|",
            "   |"
        ]
    },
    "0": {
        "width": 5,
        "lines": [
            ".--.",
            "|  |",
            "|__|"
        ]
    }

};
var charArray = ('abcdefghijklmnopqrstuvwxyz1234567890').split("");
console.log(charArray);

function text2ASCII(str_input) {
    let strArray = str_input.split("");
    let line_strs = [[' * '], [' * '], [' * ']];
    strArray.forEach(function (char) {
        if (charArray.indexOf(char) === -1) {
            console.log('not:' + char);
            line_strs[0].push((' ').repeat(4));
            line_strs[1].push((' ').repeat(4));
            line_strs[2].push((' ').repeat(4));
        } else {
            let char_max_width = 0;
            for (let i = 0; i < 3; i++) {
                char_max_width = chars[char].lines[i].length > char_max_width ? chars[char].lines[i].length : char_max_width;
            }
            for (let i = 0; i < 3; i++) {
                let curr_line_char_part_str = chars[char].lines[i];
                line_strs[i].push(curr_line_char_part_str + (' ').repeat(char_max_width - curr_line_char_part_str.length));
            }
        }
    });
    console.log(line_strs);
    let maxLen = 0;
    line_strs.forEach(function (arr) {
        if (arr.length > maxLen) maxLen = line_strs.length;
    });
    let str = ('*').repeat(150);
    return "/**" + str + "\n" + ([line_strs[0].join(" "), line_strs[1].join(" "), line_strs[2].join(" ")]).join("\n") + "\n *\n " + str + "*/";
}




