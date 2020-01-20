# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2020-1-18
### Added
- `NaniError` now supports the static `prefix` property.

### Fixed
- Typings for `info` objects have been updated from the incorrect `{}` to
  `Record<string, any>`.


## [3.0.0] - 2019-12-23
### Changed
- **BREAKING**: The `is` function's positional arguments have been reversed, in order to be more idiomatic with the rest of the JS ecosystem.


## [2.4.0] - 2019-07-16
### Added
- Typescript support
- Intellisense-compatible documentation.

## Removed
- Generated API docs.


[3.0.0]: https://github.com/sripberger/nani/releases/tag/v3.0.0
[2.4.0]: https://github.com/sripberger/nani/releases/tag/v2.4.0
