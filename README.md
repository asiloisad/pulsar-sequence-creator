# sequential-creator

<p align="center">
  <a href="https://github.com/bacadra/pulsar-sequential-creator/tags">
  <img src="https://img.shields.io/github/v/tag/bacadra/pulsar-sequential-creator?style=for-the-badge&label=Latest&color=blue" alt="Latest">
  </a>
  <a href="https://github.com/bacadra/pulsar-sequential-creator/issues">
  <img src="https://img.shields.io/github/issues-raw/bacadra/pulsar-sequential-creator?style=for-the-badge&color=blue" alt="OpenIssues">
  </a>
  <a href="https://github.com/bacadra/pulsar-sequential-creator/blob/master/package.json">
  <img src="https://img.shields.io/github/languages/top/bacadra/pulsar-sequential-creator?style=for-the-badge&color=blue" alt="Language">
  </a>
  <a href="https://github.com/bacadra/pulsar-sequential-creator/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/bacadra/pulsar-sequential-creator?style=for-the-badge&color=blue" alt="Licence">
  </a>
</p>

An Pulsar package, to inputs sequential numbers across multiple cursors.

A project is a fork of [sequential-number](https://github.com/bacadra/sequential-number/issues). List of changes:
- decaffeinated,
- event-kit replaced by built-in event class,
- repeat selecter added,
- cursors are indexed in creation order,
- keyboard shortcut changed to `Alt-0`,
- `SIMULATE_CURSOR_LENGTH` increased to 5.

## Installation

To install `sequential-creator` search for [sequential-creator](https://web.pulsar-edit.dev/packages/sequential-creator) in the Install pane of the Pulsar settings or run `ppm install sequential-creator`. Alternatively, you can run `ppm install bacadra/pulsar-sequential-creator` to install a package directly from the Github repository.

## Syntax Rules

```
<start> <operator> <step> : <digit> : <radix> : <repeat>
```

| Key | Default | Definition |
| :- | :- | :- |
| **start** | `""` | It specifies the number that you start typing an integer. |
| **operator** <small>(optional)</small> | `+` | It specifies the generation rules of consecutive numbers in the `+` or `-`. The sign of the increment(`++`) and decrement(`--`) also available. |
| **step** <small>(optional)</small> | `1` | It specifies the integer to be added or subtracted. |
| **digit** <small>(optional)</small> | `0` | It specifies of the number of digits in the integer. |
| **radix** <small>(optional)</small>   | `10` | It specifies an integer between 2 and 36 that represents radix. Or increment alphabetically by `"a"` or `"A"`. |
| **repeat** <small>(optional)</small> | `2` | It specifies an index reapeat integer greter than 1. |

#### Examples

The following sample the cursor length is `5`.

```
# Input
=> 1
=> 1++
=> 1 + 1

# Output
1
2
3
4
5
```

```
# Input
=> 1/2
=> 1++/2
=> 1 + 1/2

# Output
1
1
2
2
3
```

```
# Input
=> 10 + 2

# Output
10
12
14
16
18
```

```
# Input
=> 0027 + 3

# Output
0027
0030
0033
0036
0039
```

```
# Input
=> 010 - 1
=> 010--

# Output
010
009
008
007
006
```

```
# Input
=> -10 + 1 : 2

# Output
-10
-09
-08
-07
-06
```

```
# Input
=> 0ff + 14 : 3 : 16

# Output
0ff
10d
11b
129
137
```

```
# Input
=> 0AB239 + 2 : 6 : 16

# Output
0AB239
0AB23B
0AB23D
0AB23F
0AB241
```

```
# Input
=> a + 2 : 1 : a

# Output
a
c
e
g
i
```

```
# Input
=> c + 20 : 3 : a

# Output
aac
aaw
aaq
abk
ace
```

# Contributing [🍺](https://www.buymeacoffee.com/asiloisad)

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.
