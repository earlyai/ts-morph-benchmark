---
title: Diagnostics
---

## Diagnostics

Diagnostics (compile errors) can be retrieved on the project or on source files:

```ts
const diagnostics = project.getPreEmitDiagnostics();

// or on a source file
const sourceFileDiagnostics = sourceFile.getPreEmitDiagnostics();
```

The pre-emit diagnostics are the syntactic, semantic, global, options, config file parsing, and if enabled the declaration diagnostics.

### Formatting for Output

To nicely output the diagnostics, use `project.formatDiagnosticsWithColorAndContext`:

```ts
const diagnostics = project.getPreEmitDiagnostics();

console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
```

### Diagnostic

#### Message text

Returned message text could be a `string` or a `DiagnosticMessageChain`:

```ts
const message = diagnostic.getMessageText();
```

#### Source file

Source file the diagnostic occurs in:

```ts
const sourceFile = diagnostic.getSourceFile(); // returns: SourceFile | undefined
```

#### Start, line number, & length

Position in the file, the line number, and length of the diagnostic:

```ts
const start = diagnostic.getStart(); // returns: number
const lineNumber = diagnostic.getLineNumber(); // returns: number
const length = diagnostic.getLength(); // returns: number
```

#### Category

Categories can be warnings, errors, or just messages.

```ts
const category = diagnostic.getCategory(); // returns: DiagnosticCategory
```

#### Code

This is the error code number:

```ts
const code = diagnostic.getCode(); // returns: number
```

#### Source

todo: I don't know what this is, but it's available to get from the diagnostic.

```ts
const source = diagnostic.getSource(); // returns: string | undefined
```

### DiagnosticMessageChain

A diagnostic message chain (DMC) will be returned by `diagnostic.getMessageText()` in certain scenarios.

According to the typescript compiler:

```
/**
* A linked list of formatted diagnostic messages to be used as part of a multiline message.
* It is built from the bottom up, leaving the head to be the "main" diagnostic.
* While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
* the difference is that messages are all preformatted in DMC.
*/
```

The properties of a DMC are similar to a Diagnostic:

```ts
const messageText = dmc.getMessageText(); // returns: string
const category = dmc.getCategory(); // returns: DiagnosticCategory
const code = dmc.getCode(); // returns: number
```

#### Next DMC in linked list

Call `.getNext()`:

```ts
const next = dmc.getNext(); // returns: DiagnosticMessageChain | undefined
```
