# Spec Delta

## Purpose

Provides a searchable dictionary of English words with term, translation, definition, example, part of speech, level, and tags so learners can look up and filter vocabulary quickly.

## ADDED Requirements

### Requirement: Search dictionary
The system SHALL let clients search the dictionary by term substring and filter by level, returning matching words with their full details..

#### Scenario: Search by term
- **WHEN** a client searches with a term query
- **THEN** the response contains all words whose term contains the query as substring, case-insensitively

#### Scenario: Search with level filter
- **WHEN** a client adds a level filter to a search
- **THEN** only words at that level are returned

#### Scenario: No matches
- **WHEN** no word matches the query and filters
- **THEN** the API returns an empty array

### Requirement: Word detail
The system SHALL return a single word's full details by id, including term, translation, definition, example, part of speech, level, tags, and review progress if present..

#### Scenario: Word found
- **WHEN** a client requests an existing word by id
- **THEN** the response includes the word's full details plus its spaced-repetition progress (ease factor, interval, repetitions, lapses, due date, last reviewed)

#### Scenario: Word not found
- **WHEN** a client requests a nonexistent word id
- **THEN** the API responds with a 404 error