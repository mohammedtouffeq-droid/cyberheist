package com.cyberheist.app.data

data class LearningProgram(
    val title: String,
    val durationDays: Int,
    val dailyMinutes: Int,
    val promise: String,
    val outcome: String,
    val modules: List<CourseModule>,
    val missions: List<Mission>,
)

data class CourseModule(
    val id: String,
    val title: String,
    val subtitle: String,
    val days: List<CourseDay>,
)

data class CourseDay(
    val day: Int,
    val title: String,
    val objective: String,
    val missionId: String?,
)

data class Mission(
    val id: String,
    val title: String,
    val category: String,
    val difficulty: String,
    val duration: String,
    val xp: Int,
    val description: String,
    val day: Int?,
    val lesson: String,
    val takeaway: String,
    val practice: String,
    val scenario: String,
    val questions: List<DecisionQuestion>,
    val evidence: List<EvidenceArtifact>,
)

data class DecisionQuestion(
    val prompt: String,
    val options: List<String>,
    val answer: Int,
    val explanation: String,
)

data class EvidenceArtifact(
    val time: String,
    val label: String,
    val detail: String,
)

data class FieldNote(
    val missionId: String,
    val title: String,
    val text: String,
    val date: String,
)

data class PlayerProgress(
    val xp: Int = 0,
    val completedMissionIds: Set<String> = emptySet(),
    val notes: List<FieldNote> = emptyList(),
    val streak: Int = 0,
    val lastPlayed: String? = null,
)
