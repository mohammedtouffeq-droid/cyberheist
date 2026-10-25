package com.cyberheist.app.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.cyberheist.app.data.CourseDay
import com.cyberheist.app.data.CourseModule
import com.cyberheist.app.data.EvidenceArtifact
import com.cyberheist.app.data.Mission
import com.cyberheist.app.data.PlayerProgress

@Composable
fun FieldOfficeApp(game: GameViewModel = viewModel()) {
    val state by game.state.collectAsState()
    val mission = game.currentMission

    BackHandler(enabled = mission != null) { game.closeMission() }

    Scaffold(
        containerColor = androidx.compose.material3.MaterialTheme.colorScheme.background,
        bottomBar = {
            if (mission == null) {
                NavigationBar(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface) {
                    MainTab.entries.forEachIndexed { index, tab ->
                        NavigationBarItem(
                            selected = state.selectedTab == tab,
                            onClick = { game.selectTab(tab) },
                            icon = { Text(String.format("%02d", index + 1), fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                            label = { Text(tab.label, maxLines = 1, overflow = TextOverflow.Ellipsis) },
                        )
                    }
                }
            }
        },
    ) { padding ->
        if (mission != null) {
            MissionRoute(
                mission = mission,
                state = state,
                question = game.currentQuestion,
                onBack = game::closeMission,
                onRetry = { game.startMission(mission.id) },
                onAnswer = game::chooseAnswer,
                onNext = game::advanceDecision,
                onNoteChange = game::editNote,
                onSaveNote = game::saveFieldNote,
            )
        } else if (state.program == null) {
            LoadingErrorScreen(state.loadingError, Modifier.padding(padding))
        } else {
            Column(Modifier.fillMaxSize().padding(padding)) {
                BrandBar()
                when (state.selectedTab) {
                    MainTab.BRIEFING -> BriefingScreen(state.progress, game, Modifier.weight(1f))
                    MainTab.ACADEMY -> AcademyScreen(game, Modifier.weight(1f))
                    MainTab.CASES -> CaseFilesScreen(game, state.progress, Modifier.weight(1f))
                    MainTab.NOTES -> FieldNotesScreen(state.progress, Modifier.weight(1f))
                    MainTab.RECORD -> RecordScreen(state.progress, game, Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun BrandBar() {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Surface(shape = RoundedCornerShape(8.dp), color = androidx.compose.material3.MaterialTheme.colorScheme.primary) {
                Text("CH", Modifier.padding(horizontal = 10.dp, vertical = 8.dp), color = androidx.compose.material3.MaterialTheme.colorScheme.onPrimary, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
            Spacer(Modifier.width(10.dp))
            Column {
                Text("CYBERHEIST", fontSize = 13.sp, fontWeight = FontWeight.Black, letterSpacing = 1.2.sp)
                Text("SECURITY FIELD OFFICE", fontSize = 8.sp, letterSpacing = 1.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Text("OFFLINE · LOCAL PROFILE", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
    }
}

@Composable
private fun BriefingScreen(progress: PlayerProgress, game: GameViewModel, modifier: Modifier = Modifier) {
    val mission = game.dailyMission()
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp, vertical = 8.dp)) {
        Eyebrow("OPERATOR BRIEFING")
        Text("Good instincts are\nyour best firewall.", fontFamily = FontFamily.Serif, fontSize = 31.sp, lineHeight = 35.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurface)
        Spacer(Modifier.height(7.dp))
        Text("Read the signal. Make the call. Learn why it matters.", color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
        Spacer(Modifier.height(18.dp))
        if (mission != null) {
            Card(colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.primary), shape = RoundedCornerShape(12.dp)) {
                Column(Modifier.fillMaxWidth().padding(18.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Eyebrow("TODAY'S TRAINING", light = true)
                        Text("DAY ${mission.day?.toString()?.padStart(2, '0') ?: "01"} / 60", fontSize = 9.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onPrimary)
                    }
                    Spacer(Modifier.height(19.dp))
                    Text(mission.category, fontSize = 9.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
                    Text(mission.title, fontFamily = FontFamily.Serif, fontSize = 26.sp, lineHeight = 30.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onPrimary)
                    Spacer(Modifier.height(7.dp))
                    Text(mission.description, fontSize = 14.sp, lineHeight = 20.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onPrimary.copy(alpha = .86f))
                    Spacer(Modifier.height(17.dp))
                    Button(onClick = { game.startMission(mission.id) }, colors = ButtonDefaults.buttonColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface, contentColor = androidx.compose.material3.MaterialTheme.colorScheme.primary)) {
                        Text("Open the case  ↗", fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.height(8.dp))
                    Text("LESSON  ·  FICTIONAL SIMULATION  ·  +${mission.xp} XP", fontSize = 8.sp, letterSpacing = .6.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onPrimary)
                }
            }
        }
        Spacer(Modifier.height(15.dp))
        RecordCard(progress, game)
        Spacer(Modifier.height(16.dp))
        Text("YOUR NEXT MOVE", fontWeight = FontWeight.Bold, letterSpacing = 1.sp, fontSize = 10.sp)
        Spacer(Modifier.height(8.dp))
        Text("Short daily cases. A clear reason behind every safer choice. Progress stays on this device.", fontSize = 11.sp, lineHeight = 17.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(18.dp))
    }
}

@Composable
private fun RecordCard(progress: PlayerProgress, game: GameViewModel) {
    Card(colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline), shape = RoundedCornerShape(10.dp)) {
        Column(Modifier.fillMaxWidth().padding(14.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text("YOUR FIELD RANK", fontSize = 8.sp, fontWeight = FontWeight.Bold, letterSpacing = .8.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(game.levelName(), fontFamily = FontFamily.Serif, fontSize = 20.sp)
                }
                Text("${progress.xp} XP", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.primary)
            }
            Spacer(Modifier.height(8.dp))
            LinearProgressIndicator(progress = { game.levelProgress() }, modifier = Modifier.fillMaxWidth().height(5.dp), color = androidx.compose.material3.MaterialTheme.colorScheme.secondary, trackColor = androidx.compose.material3.MaterialTheme.colorScheme.surfaceVariant)
            Spacer(Modifier.height(7.dp))
            Text("${progress.completedMissionIds.size} CASES CLEARED     ·     ${progress.streak} DAY STREAK", fontSize = 8.sp, letterSpacing = .4.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun AcademyScreen(game: GameViewModel, modifier: Modifier = Modifier) {
    val state by game.state.collectAsState()
    val program = state.program ?: return
    val mappedDays = program.modules.flatMap(CourseModule::days)
    val completedDays = mappedDays.count { day -> game.missionFor(day)?.id in state.progress.completedMissionIds }
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp, vertical = 6.dp)) {
        Eyebrow("THE FIELD ACADEMY")
        Text("A ${program.durationDays}-day route to strong foundations.", fontFamily = FontFamily.Serif, fontSize = 27.sp, lineHeight = 31.sp)
        Spacer(Modifier.height(5.dp))
        Text("Short daily lessons, fictional decisions, and a private field note. This path builds foundations; it does not promise expert status.", fontSize = 13.sp, lineHeight = 19.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(12.dp))
        Text("$completedDays / ${program.durationDays} DAYS COMPLETE  ·  ${program.missions.size} LESSONS PLAYABLE", fontSize = 9.sp, fontWeight = FontWeight.Bold, letterSpacing = .5.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.primary)
        Spacer(Modifier.height(6.dp))
        LinearProgressIndicator(progress = { completedDays / program.durationDays.toFloat() }, modifier = Modifier.fillMaxWidth().height(4.dp), color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
        Spacer(Modifier.height(12.dp))
        program.modules.forEach { module -> ModuleCard(module, game, state.progress) }
        Spacer(Modifier.height(12.dp))
    }
}

@Composable
private fun ModuleCard(module: CourseModule, game: GameViewModel, progress: PlayerProgress) {
    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline), shape = RoundedCornerShape(9.dp)) {
        Column(Modifier.fillMaxWidth().padding(13.dp)) {
            val firstDay = module.days.firstOrNull()?.day ?: 0
            val lastDay = module.days.lastOrNull()?.day ?: firstDay
            Eyebrow("DAYS ${firstDay.toString().padStart(2, '0')}–${lastDay.toString().padStart(2, '0')}")
            Text(module.title, fontFamily = FontFamily.Serif, fontSize = 19.sp)
            Text(module.subtitle, fontSize = 12.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(7.dp))
            module.days.forEach { day -> CourseDayRow(day, game, progress) }
        }
    }
}

@Composable
private fun CourseDayRow(day: CourseDay, game: GameViewModel, progress: PlayerProgress) {
    val mission = game.missionFor(day)
    val done = mission?.id?.let { it in progress.completedMissionIds } == true
    Row(Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.spacedBy(9.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(day.day.toString().padStart(2, '0'), fontFamily = FontFamily.Serif, fontSize = 15.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary, modifier = Modifier.width(25.dp))
        Column(Modifier.weight(1f)) {
            Text(day.title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            if (mission == null) Text(day.objective, fontSize = 10.sp, lineHeight = 14.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2, overflow = TextOverflow.Ellipsis)
        }
        if (mission != null) {
            TextButton(onClick = { game.startMission(mission.id) }) { Text(if (done) "REPLAY" else "PLAY", fontSize = 8.sp, fontWeight = FontWeight.Bold) }
        } else {
            Text("PLANNED", fontSize = 7.sp, letterSpacing = .5.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun CaseFilesScreen(game: GameViewModel, progress: PlayerProgress, modifier: Modifier = Modifier) {
    val missions = game.state.collectAsState().value.program?.missions.orEmpty()
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp, vertical = 8.dp)) {
        Eyebrow("THE CASE LIBRARY")
        Text("Choose what to investigate.", fontFamily = FontFamily.Serif, fontSize = 27.sp, lineHeight = 31.sp)
        Text("${missions.size.toString().padStart(2, '0')} FICTIONAL CASES AVAILABLE", fontSize = 8.sp, letterSpacing = .8.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(10.dp))
        missions.forEach { mission -> MissionCard(mission, mission.id in progress.completedMissionIds) { game.startMission(mission.id) } }
        Spacer(Modifier.height(12.dp))
    }
}

@Composable
private fun MissionCard(mission: Mission, completed: Boolean, onStart: () -> Unit) {
    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline), shape = RoundedCornerShape(10.dp)) {
        Column(Modifier.fillMaxWidth().padding(14.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(mission.category, fontSize = 8.sp, fontWeight = FontWeight.Bold, letterSpacing = .6.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
                Text(mission.difficulty.uppercase(), fontSize = 8.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Text(mission.title, fontFamily = FontFamily.Serif, fontSize = 19.sp)
            Text(mission.description, fontSize = 12.sp, lineHeight = 17.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(5.dp))
            Text("${mission.duration.uppercase()}  ·  ${mission.xp} XP", fontSize = 8.sp, letterSpacing = .5.sp)
            TextButton(onClick = onStart) { Text(if (completed) "Replay for practice  →" else "Open case  →", fontWeight = FontWeight.Bold) }
        }
    }
}

@Composable
private fun FieldNotesScreen(progress: PlayerProgress, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 16.dp, vertical = 8.dp)) {
        Eyebrow("OPERATOR JOURNAL")
        Text("Field notes", fontFamily = FontFamily.Serif, fontSize = 28.sp)
        Text("Notes stay on this device. Never write passwords or recovery codes here.", fontSize = 12.sp, lineHeight = 17.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(12.dp))
        if (progress.notes.isEmpty()) {
            EmptyCard("No field notes yet. Finish a case and save a takeaway you want to keep.")
        } else {
            progress.notes.forEach { note ->
                Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline)) {
                    Column(Modifier.padding(13.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(note.title, fontFamily = FontFamily.Serif, fontSize = 16.sp, modifier = Modifier.weight(1f))
                            Spacer(Modifier.width(8.dp))
                            Text(note.date, fontSize = 8.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(note.text, fontSize = 12.sp, lineHeight = 17.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun RecordScreen(progress: PlayerProgress, game: GameViewModel, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 18.dp, vertical = 8.dp)) {
        Eyebrow("YOUR RECORD")
        Text("Field experience", fontFamily = FontFamily.Serif, fontSize = 29.sp)
        Spacer(Modifier.height(12.dp))
        RecordCard(progress, game)
        Spacer(Modifier.height(14.dp))
        StatCard("LESSONS CLEARED", "${progress.completedMissionIds.size}")
        StatCard("FIELD NOTES", "${progress.notes.size}")
        StatCard("CURRENT STREAK", "${progress.streak} days")
        Spacer(Modifier.height(10.dp))
        Text("Experience points reward first-time case completion. Replays are for practice and do not add XP.", fontSize = 12.sp, lineHeight = 17.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun MissionRoute(
    mission: Mission,
    state: GameUiState,
    question: com.cyberheist.app.data.DecisionQuestion?,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onAnswer: (Int) -> Unit,
    onNext: () -> Unit,
    onNoteChange: (String) -> Unit,
    onSaveNote: () -> Unit,
) {
    val optionOrder = remember(mission.id, state.questionIndex) {
        question?.options?.indices?.shuffled().orEmpty()
    }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(horizontal = 18.dp, vertical = 10.dp)) {
        TextButton(onClick = onBack) { Text("← BACK TO CASES") }
        if (state.missionFinished) {
            Eyebrow("CASE DEBRIEF")
            val required = kotlin.math.ceil(mission.questions.size * 2.0 / 3.0).toInt()
            Text(if (state.missionPassed) "Case cleared." else "Review, then retry.", fontFamily = FontFamily.Serif, fontSize = 30.sp)
            Text("${state.correctAnswers} / ${mission.questions.size} decisions matched the safest choice", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                when {
                    !state.missionPassed -> "$required correct answers are needed to clear this lesson. Review the explanations and retry; this attempt does not count toward course progress."
                    state.earnedXp > 0 -> "+${state.earnedXp} XP earned"
                    else -> "Already cleared · replay for practice · no repeat XP"
                },
                color = androidx.compose.material3.MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                lineHeight = 17.sp,
            )
            Text(mission.takeaway, Modifier.padding(top = 12.dp), fontSize = 12.sp, lineHeight = 18.sp)
            if (!state.missionPassed) {
                Button(onClick = onRetry, modifier = Modifier.fillMaxWidth().padding(top = 14.dp)) { Text("Retry this case") }
            } else {
                Spacer(Modifier.height(16.dp))
                OutlinedTextField(
                    value = state.noteDraft,
                    onValueChange = onNoteChange,
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text("Your private field note") },
                    supportingText = { Text("${state.noteDraft.length} / 280 · on this device · no passwords or codes") },
                    maxLines = 4,
                )
                Spacer(Modifier.height(8.dp))
                Button(onClick = onSaveNote, modifier = Modifier.fillMaxWidth()) { Text(if (state.noteSaved) "Field note saved ✓" else "Save field note") }
            }
            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = onBack, modifier = Modifier.fillMaxWidth()) { Text("Back to field office") }
        } else {
            Eyebrow("${mission.category}  ·  DAY ${mission.day?.toString()?.padStart(2, '0') ?: "—"}")
            Text(mission.title, fontFamily = FontFamily.Serif, fontSize = 29.sp, lineHeight = 33.sp)
            Text(mission.description, fontSize = 13.sp, lineHeight = 18.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            LessonCard(mission.lesson)
            InfoCard("THE SITUATION", mission.scenario)
            if (mission.practice.isNotBlank()) PracticeCard(mission.practice)
            if (mission.evidence.isNotEmpty()) EvidenceCard(mission.evidence)
            question?.let { current ->
                Spacer(Modifier.height(9.dp))
                Text("DECISION ${state.questionIndex + 1} OF ${mission.questions.size}", fontSize = 8.sp, letterSpacing = 1.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
                Text(current.prompt, Modifier.padding(top = 5.dp, bottom = 7.dp), fontWeight = FontWeight.Bold, fontSize = 15.sp, lineHeight = 20.sp)
                optionOrder.forEach { answerIndex ->
                    val option = current.options[answerIndex]
                    val selected = state.selectedAnswer == answerIndex
                    val correct = state.selectedAnswer != null && answerIndex == current.answer
                    OutlinedButton(
                        onClick = { onAnswer(answerIndex) },
                        modifier = Modifier.fillMaxWidth().padding(vertical = 3.dp),
                        enabled = state.selectedAnswer == null,
                        border = BorderStroke(1.dp, when {
                            correct -> androidx.compose.material3.MaterialTheme.colorScheme.primary
                            selected -> androidx.compose.material3.MaterialTheme.colorScheme.error
                            else -> androidx.compose.material3.MaterialTheme.colorScheme.outline
                        }),
                    ) { Text(option, Modifier.fillMaxWidth(), fontSize = 12.sp, lineHeight = 17.sp) }
                }
                if (state.selectedAnswer != null) {
                    val correct = state.selectedAnswer == current.answer
                    InfoCard(if (correct) "GOOD CALL" else "HERE'S THE SAFER MOVE", current.explanation)
                    Button(onClick = onNext, modifier = Modifier.fillMaxWidth().padding(top = 7.dp)) {
                        Text(if (state.questionIndex + 1 < mission.questions.size) "Next decision  →" else "See debrief  →")
                    }
                }
            }
        }
        Spacer(Modifier.height(20.dp))
    }
}

@Composable
private fun LessonCard(lesson: String) {
    Card(Modifier.fillMaxWidth().padding(top = 12.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surfaceVariant), shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(12.dp)) {
            Eyebrow("FIELD GUIDE")
            Text(lesson, fontSize = 12.sp, lineHeight = 18.sp)
        }
    }
}

@Composable
private fun PracticeCard(practice: String) {
    Card(Modifier.fillMaxWidth().padding(top = 9.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surfaceVariant), shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(12.dp)) {
            Eyebrow("FIELD PRACTICE")
            Text(practice, fontSize = 12.sp, lineHeight = 18.sp)
            Text("Use only your own device/settings or this fictional case. Never enter or share passwords or codes.", Modifier.padding(top = 7.dp), fontSize = 10.sp, lineHeight = 15.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun InfoCard(label: String, body: String) {
    Card(Modifier.fillMaxWidth().padding(top = 9.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline), shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(12.dp)) {
            Eyebrow(label)
            Text(body, fontSize = 12.sp, lineHeight = 17.sp)
        }
    }
}

@Composable
private fun EvidenceCard(evidence: List<EvidenceArtifact>) {
    Card(Modifier.fillMaxWidth().padding(top = 9.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surfaceVariant), shape = RoundedCornerShape(8.dp)) {
        Column(Modifier.padding(12.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Eyebrow("EVIDENCE DESK")
                Text("FICTIONAL · STATIC", fontSize = 7.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            }
            evidence.forEachIndexed { index, artifact ->
                Row(Modifier.fillMaxWidth().padding(top = 9.dp), horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
                    Text("${(index + 1).toString().padStart(2, '0')}  ${artifact.time}", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.secondary)
                    Column {
                        Text(artifact.label, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text(artifact.detail, fontSize = 11.sp, lineHeight = 16.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}

@Composable
private fun LoadingErrorScreen(message: String?, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxSize().padding(24.dp), verticalArrangement = Arrangement.Center) {
        Eyebrow("FIELD OFFICE")
        Text("Course files aren't ready.", fontFamily = FontFamily.Serif, fontSize = 28.sp)
        Text(message ?: "Check the bundled lesson files, then reopen the app.", Modifier.padding(top = 8.dp), fontSize = 12.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun EmptyCard(message: String) {
    Card(Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline)) {
        Text(message, Modifier.padding(16.dp), fontSize = 11.sp, lineHeight = 17.sp, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun StatCard(label: String, value: String) {
    Card(Modifier.fillMaxWidth().padding(vertical = 4.dp), colors = CardDefaults.cardColors(containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface), border = BorderStroke(1.dp, androidx.compose.material3.MaterialTheme.colorScheme.outline)) {
        Row(Modifier.fillMaxWidth().padding(15.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            Text(label, fontSize = 9.sp, letterSpacing = .7.sp, fontWeight = FontWeight.Bold, color = androidx.compose.material3.MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, fontFamily = FontFamily.Serif, fontSize = 20.sp)
        }
    }
}

@Composable
private fun Eyebrow(text: String, light: Boolean = false) {
    Text(
        text,
        fontSize = 8.sp,
        letterSpacing = 1.sp,
        fontWeight = FontWeight.Bold,
        color = if (light) androidx.compose.material3.MaterialTheme.colorScheme.onPrimary.copy(alpha = .75f) else androidx.compose.material3.MaterialTheme.colorScheme.secondary,
    )
}
