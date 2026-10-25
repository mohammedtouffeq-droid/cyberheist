package com.cyberheist.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.json.JSONArray
import org.json.JSONObject

private val Context.fieldOfficeDataStore: DataStore<Preferences> by preferencesDataStore(name = "field-progress-v1")

class PlayerProgressRepository(private val context: Context) {
    val progress: Flow<PlayerProgress> = context.fieldOfficeDataStore.data.map { preferences ->
        PlayerProgress(
            xp = preferences[KEY_XP]?.coerceAtLeast(0) ?: 0,
            completedMissionIds = preferences[KEY_COMPLETED].orEmpty(),
            notes = decodeNotes(preferences[KEY_NOTES] ?: "[]"),
            streak = preferences[KEY_STREAK]?.coerceAtLeast(0) ?: 0,
            lastPlayed = preferences[KEY_LAST_PLAYED],
        )
    }

    suspend fun save(progress: PlayerProgress) {
        context.fieldOfficeDataStore.edit { preferences ->
            preferences[KEY_XP] = progress.xp.coerceAtLeast(0)
            preferences[KEY_COMPLETED] = progress.completedMissionIds
            preferences[KEY_NOTES] = encodeNotes(progress.notes.take(100))
            preferences[KEY_STREAK] = progress.streak.coerceAtLeast(0)
            progress.lastPlayed?.let { preferences[KEY_LAST_PLAYED] = it }
                ?: preferences.remove(KEY_LAST_PLAYED)
        }
    }

    private fun decodeNotes(encoded: String): List<FieldNote> = runCatching {
        val notes = JSONArray(encoded)
        List(notes.length()) { index ->
            val item = notes.getJSONObject(index)
            FieldNote(
                missionId = item.optString("missionId"),
                title = item.optString("title"),
                text = item.optString("text"),
                date = item.optString("date"),
            )
        }.filter { it.missionId.isNotBlank() && it.text.isNotBlank() }.take(100)
    }.getOrDefault(emptyList())

    private fun encodeNotes(notes: List<FieldNote>): String = JSONArray().apply {
        notes.forEach { note ->
            put(JSONObject().apply {
                put("missionId", note.missionId)
                put("title", note.title)
                put("text", note.text)
                put("date", note.date)
            })
        }
    }.toString()

    private companion object {
        val KEY_XP = intPreferencesKey("xp")
        val KEY_COMPLETED = stringSetPreferencesKey("completed")
        val KEY_NOTES = stringPreferencesKey("notes")
        val KEY_STREAK = intPreferencesKey("streak")
        val KEY_LAST_PLAYED = stringPreferencesKey("lastPlayed")
    }
}
