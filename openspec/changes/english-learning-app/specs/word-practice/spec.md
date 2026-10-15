# Spec Delta

## Purpose

Provides spaced-repetition word review (SM-2 algorithm) so learners practice due words, rate their recall quality 0-5, and the system schedules each word's next review accordingly.

## ADDED Requirements

### Requirement: Due word queue
The system SHALL expose the queue of words due for review, optionally limited in count, joining each word with its review progress..

#### Scenario: Due words returned
- **WHEN** a client requests due words with a count limit
- **THEN** the response contains at most that many words whose due date is today or earlier, each with its full word details and progress

#### Scenario: No due words
- **WHEN** no words are due
- **THEN** the API returns an empty array

### Requirement: Submit review quality
The system SHALL accept a review quality 0-5 for a word and update that word's spaced-repetition progress using SM-2, returning the updated progress..

#### Scenario: Successful review
- **WHEN** a client submits a quality rating for an existing word
- **THEN** the word's progress is recomputed (ease factor, interval, repetitions, lapses, due date) and the updated progress is returned

#### Scenario: Review unknown word
- **WHEN** a client submits a review for a nonexistent word
- **THEN** the API responds with a 404 error and no progress is changed

#### Scenario: Invalid quality
- **WHEN** a client submits a quality outside the range 0-5
- **THEN** the API responds with a 400 error and no progress is changed

#### Scenario: Quality below 3 resets schedule
- **WHEN** a submitted quality is below 3 for a word previously scheduled
- **THEN** repetitions reset to zero, interval becomes one day, lapses increase by one, and the due date advances by one day

#### Scenario: Quality 3 or above advances schedule
- **WHEN** a submitted quality is 3 or above
- **THEN** repetitions increase, interval follows the SM-2 progression (first repetition one day, second six days, subsequent rounds of interval times ease factor), the ease factor is updated per SM-2, and the due date advances by the new interval