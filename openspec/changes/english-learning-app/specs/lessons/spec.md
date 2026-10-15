# Spec Delta

## Purpose

Provides curated lessons with explanatory content and typed exercises (multiple-choice, fill-blank, translation) so learners can study vocabulary and grammar in structured units with immediate feedback.

## ADDED Requirements

### Requirement: List lessons
The system SHALL provide a list of lessons ordered by the configured lesson order, each entry exposing title, description, level, and id..

#### Scenario: Empty lesson list
- **WHEN** no lessons exist in the system
- **THEN** the API returns an empty array

#### Scenario: Lessons ordered
- **WHEN** lessons exist
- **THEN** they are returned in ascending `order` sequence with title, description, level, and id present

### Requirement: View lesson with exercises
The system SHALL return a lesson by id including its explanation sections and exercises with all options and the correct answer, so the client can give instant feedback without extra requests..

#### Scenario: Lesson found
- **WHEN** a client requests an existing lesson by id
- **THEN** the response includes the lesson's title, description, level, its ordered exercises, each with type, prompt, explanation, options, and which option is correct

#### Scenario: Lesson not found
- **WHEN** a client requests a nonexistent lesson id
- **THEN** the API responds with a 404 error

#### Scenario: Exercise option shape
- **WHEN** an exercise is of type `mcq`
- **THEN** it includes an ordered list of options with text and an `is_correct` flag on exactly one option
- **WHEN** an exercise is of type `fill_blank` or `translation`
- **THEN** it exposes the expected answer so feedback can be checked client-side

### Requirement: Record exercise attempts
The system SHALL record exercise attempts for a lesson in a single batch, storing the exercise, the answer given, whether it was correct, and the time it was answered..

#### Scenario: Batch attempt submission
- **WHEN** a client posts a batch of attempts for an existing lesson
- **THEN** every attempt is stored with exercise reference, answer text, correctness flag, and timestamp

#### Scenario: Attempts for unknown lesson
- **WHEN** a client posts attempts referencing a nonexistent lesson
- **THEN** the API responds with a 404 error and stores no attempts