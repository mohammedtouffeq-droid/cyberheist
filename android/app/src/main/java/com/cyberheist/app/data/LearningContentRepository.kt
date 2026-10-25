package com.cyberheist.app.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

class LearningContentRepository(context: Context) {
    private val assets = context.applicationContext.assets

    fun loadProgram(): LearningProgram {
        val course = JSONObject(assets.open("curriculum.json").bufferedReader().use { it.readText() })
        val missionFile = JSONObject(assets.open("missions.json").bufferedReader().use { it.readText() })
        val program = course.getJSONObject("program")
        val missions = missionFile.getJSONArray("missions").mapObjects(::parseMission)
        val modules = course.getJSONArray("modules").mapObjects { item ->
            val days = item.getJSONArray("days").mapObjects { day ->
                CourseDay(
                    day = day.getInt("day"),
                    title = day.getString("title"),
                    objective = day.getString("objective"),
                    missionId = day.optString("mission_id").takeIf { it.isNotBlank() },
                )
            }
            CourseModule(
                id = item.getString("id"),
                title = item.getString("title"),
                subtitle = item.getString("subtitle"),
                days = days,
            )
        }

        val mappedMissionIds = modules.flatMap(CourseModule::days).mapNotNull(CourseDay::missionId).toSet()
        val availableMissionIds = missions.map(Mission::id).toSet()
        require(mappedMissionIds.all(availableMissionIds::contains)) { "Course map references an unavailable mission." }
        require(missions.all { it.questions.isNotEmpty() && it.questions.all { q -> q.answer in q.options.indices } }) {
            "A lesson has no decisions or an invalid answer reference."
        }

        return LearningProgram(
            title = program.getString("title"),
            durationDays = program.getInt("duration_days"),
            dailyMinutes = program.getInt("daily_minutes"),
            promise = program.getString("promise"),
            outcome = program.getString("outcome"),
            modules = modules,
            missions = missions,
        )
    }

    private fun parseMission(item: JSONObject): Mission {
        val questions = item.getJSONArray("questions").mapObjects { question ->
            DecisionQuestion(
                prompt = question.getString("prompt"),
                options = question.getJSONArray("options").mapStrings(),
                answer = question.getInt("answer"),
                explanation = question.getString("explanation"),
            )
        }
        val evidence = item.optJSONArray("evidence")?.mapObjects { artifact ->
            EvidenceArtifact(
                time = artifact.getString("time"),
                label = artifact.getString("label"),
                detail = artifact.getString("detail"),
            )
        }.orEmpty()
        return Mission(
            id = item.getString("id"),
            title = item.getString("title"),
            category = item.getString("category"),
            difficulty = item.getString("difficulty"),
            duration = item.getString("duration"),
            xp = item.getInt("xp"),
            description = item.getString("description"),
            day = item.optInt("day").takeIf { it > 0 },
            lesson = item.optString("lesson"),
            takeaway = item.optString("takeaway"),
            practice = item.optString("practice"),
            scenario = item.getString("scenario"),
            questions = questions,
            evidence = evidence,
        )
    }
}

private inline fun <T> JSONArray.mapObjects(transform: (JSONObject) -> T): List<T> =
    List(length()) { index -> transform(getJSONObject(index)) }

private fun JSONArray.mapStrings(): List<String> = List(length()) { index -> getString(index) }
