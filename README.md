# sequence-creator

A Pulsar package, to inputs sequential numbers across multiple cursors.

A project is a fork of [sequential-number](https://github.com/bacadra/sequential-number/issues). List of changes:
- decaffeinated,
- replaced `event-kit` with built-in event class,
- added `repeat` selector,
- cursors are indexed by creation order by default,
- optional flag `!` used to reorder cursors by position,
- keyboard shortcut changed to `Alt-0`,
- `SIMULATE_CURSOR_LENGTH` changed to config option,
- changed preview font to match editor font,
- last sequence is not deleted, but selected,
- changed algorithm of strings, it's easier to use now, but less powerful.

## Installation

To install `sequence-creator` search for [sequence-creator](https://web.pulsar-edit.dev/packages/sequence-creator) in the Install pane of the Pulsar settings or run `ppm install sequence-creator`. Alternatively, you can run `ppm install bacadra/pulsar-sequence-creator` to install a package directly from the Github repository.

## Syntax Rules

```
<start><operator><step><#radix><:padding><^repeat><flags>
```

| Key | Default | Definition |
| :- | :- | :- |
| start | _mandatory_ | item that you start typing, e.g. `1`, `-1`, `+1`, `21`, `a`, `ac`, `aC` |
| operator | `+` | operation to calculate next step value: `+` or `-` |
| step | `1` | integer to be added or subtracted, e.g. `2`, `-2`, `+2` |
| radix | 10 | The integer between 2 and 36 that represents radix |
| padding | _empty_ | The padding command, e.g. `<2`, ` <2`, `0<2`, `a<2` |
| repeat | 1 | An index repeat count as positive integer |
| flags | _empty_ | A mix of letters:<br/>`!` reorder cursors by position<br/>`@` print plus sign if positive |

#### Examples

The following sample the cursor length is `5`.

```
Input
  => 1
  => 1+
  => 1+1

Output:
  => 1, 2, 3, 4, 5

Input
  => 1^2
  => 1+^2
  => 1+1^2

Output:
  1, 1, 2, 2, 3

Input
  => 10+2

Output:
  10, 12, 14, 16, 18

Input
  => 0027+3
  => 27+3:>4
  => 27+3:0>4

Output:
  0027, 0030, 0033, 0036, 0039

Input
  => a+2

Output:
  a, c, e, g, i

Input
  => c+20

Output:
  c, w, aq, bk, ce

Input
  => c+20:a>3

Output:
  aac, aaw, aaq, abk, ace
```

# Contributing

If you have any ideas on how to improve the package, spot any bugs, or would like to support the development of new features, please feel free to share them via GitHub.
