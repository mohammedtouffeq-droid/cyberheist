package com.cyberheist.app.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.cyberheist.app.data.CourseDay
import com.cyberheist.app.data.FieldNote
import com.cyberheist.app.data.LearningContentRepository
import com.cyberheist.app.data.LearningProgram
import com.cyberheist.app.data.Mission
import com.cyberheist.app.data.PlayerProgress
import com.cyberheist.app.data.PlayerProgressRepository
import java.time.LocalDate
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import androidx.lifecycle.viewModelScope

enum class MainTab(val label: String) {
    BRIEFING("Briefing"),
    ACADEMY("Academy"),
    CASES("Cases"),
    NOTES("Notes"),
    RECORD("Record"),
}

data class GameUiState(
    val program: LearningProgram? = null,
    val progress: PlayerProgress = PlayerProgress(),
    val selectedTab: MainTab = MainTab.BRIEFING,
    val activeMissionId: String? = null,
    val questionIndex: Int = 0,
    val selectedAnswer: Int? = null,
    val correctAnswers: Int = 0,
    val missionFinished: Boolean = false,
    val earnedXp: Int = 0,
    val noteDraft: String = "",
    val noteSaved: Boolean = false,
    val loadingError: String? = null,
)

class GameViewModel(application: Application) : AndroidViewModel(application) {
    private val contentRepository = LearningContentRepository(application)
    private val progressRepository = PlayerProgressRepository(application)
    private val _state = MutableStateFlow(GameUiState())
    val state: StateFlow<GameUiState> = _state.asStateFlow()

    init {
        _state.value = runCatching { _state.value.copy(program = contentRepository.loadProgram()) }
            .getOrElse { _state.value.copy(loadingError = "Course files need attention. Your saved progress is still on this device.") }
        viewModelScope.launch {
            progressRepository.progress.collect { progress -> _state.update { it.copy(progress = progress) } }
        }
    }

    val currentMission: Mission?
        get() = _state.value.program?.missions?.find { it.id == _state.value.activeMissionId }

    val currentQuestion
        get() = currentMission?.questions?.getOrNull(_state.value.questionIndex)

    fun selectTab(tab: MainTab) {
        if (_state.value.activeMissionId == null) _state.value = _state.value.copy(selectedTab = tab)
    }

    fun missionFor(day: CourseDay): Mission? =
        day.missionId?.let { id -> _state.value.program?.missions?.find { it.id == id } }

    fun dailyMission(): Mission? {
        val missions = _state.value.program?.missions.orEmpty().filter { it.day != null }.sortedBy { it.day }
        return missions.firstOrNull { it.id !in _state.value.progress.completedMissionIds } ?: missions.firstOrNull()
    }

    fun startMission(missionId: String) {
        val mission = _state.value.program?.missions?.find { it.id == missionId } ?: return
        if (mission.questions.isEmpty()) return
        _state.value = _state.value.copy(
            activeMissionId = mission.id,
            questionIndex = 0,
            selectedAnswer = null,
            correctAnswers = 0,
            missionFinished = false,
            earnedXp = 0,
            noteDraft = _state.value.progress.notes.firstOrNull { it.missionId == mission.id }
                ?.text?.takeIf { it != mission.takeaway }.orEmpty(),
            noteSaved = false,
        )
    }

    fun chooseAnswer(index: Int) {
        val question = currentQuestion ?: return
        if (_state.value.selectedAnswer != null || index !in question.options.indices) return
        val correct = index == question.answer
        _state.value = _state.value.copy(
            selectedAnswer = index,
            correctAnswers = _state.value.correctAnswers + if (correct) 1 else 0,
        )
    }

    fun advanceDecision() {
        val state = _state.value
        val mission = currentMission ?: return
        if (state.selectedAnswer == null || state.missionFinished) return
        if (state.questionIndex + 1 < mission.questions.size) {
            _state.value = state.copy(questionIndex = state.questionIndex + 1, selectedAnswer = null)
            return
        }

        val alreadyCompleted = mission.id in state.progress.completedMissionIds
        val earned = if (alreadyCompleted) 0 else mission.xp
        val today = LocalDate.now()
        val previous = state.progress.lastPlayed?.let { runCatching { LocalDate.parse(it) }.getOrNull() }
        val nextStreak = when {
            previous == today -> state.progress.streak
            previous == today.minusDays(1) -> state.progress.streak + 1
            else -> 1
        }
        val progress = state.progress.copy(
            xp = state.progress.xp + earned,
            completedMissionIds = state.progress.completedMissionIds + mission.id,
            streak = nextStreak,
            lastPlayed = today.toString(),
        )
        viewModelScope.launch { progressRepository.save(progress) }
        _state.value = state.copy(progress = progress, earnedXp = earned, missionFinished = true)
    }

    fun editNote(text: String) {
        _state.value = _state.value.copy(noteDraft = text.take(280), noteSaved = false)
    }

    fun saveFieldNote() {
        val state = _state.value
        val mission = currentMission ?: return
        val text = state.noteDraft.trim().ifBlank { mission.takeaway.ifBlank { "Review the explanation from this case." } }
        val note = FieldNote(missionId = mission.id, title = mission.title, text = text, date = LocalDate.now().toString())
        val notes = (listOf(note) + state.progress.notes.filterNot { it.missionId == mission.id }).take(100)
        val progress = state.progress.copy(notes = notes)
        viewModelScope.launch { progressRepository.save(progress) }
        _state.value = state.copy(progress = progress, noteDraft = text, noteSaved = true)
    }

    fun closeMission() {
        _state.value = _state.value.copy(
            activeMissionId = null,
            questionIndex = 0,
            selectedAnswer = null,
            missionFinished = false,
            noteSaved = false,
        )
    }

    fun levelName(xp: Int = _state.value.progress.xp): String = when {
        xp >= 600 -> "Guardian"
        xp >= 300 -> "Defender"
        xp >= 120 -> "Scout"
        else -> "Rookie"
    }

    fun levelProgress(xp: Int = _state.value.progress.xp): Float = when {
        xp >= 600 -> 1f
        xp >= 300 -> (xp - 300) / 300f
        xp >= 120 -> (xp - 120) / 180f
        else -> xp / 120f
    }.coerceIn(0f, 1f)
}
