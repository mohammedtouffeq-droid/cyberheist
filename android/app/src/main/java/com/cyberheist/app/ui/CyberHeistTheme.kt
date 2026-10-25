package com.cyberheist.app.ui

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val FieldPaper = Color(0xFFF1EEE6)
private val FieldInk = Color(0xFF29332C)
private val Forest = Color(0xFF3D5941)
private val Rust = Color(0xFF965C3A)
private val Quiet = Color(0xFF71756B)

private val FieldColorScheme = lightColorScheme(
    primary = Forest,
    onPrimary = FieldPaper,
    secondary = Rust,
    onSecondary = Color.White,
    background = FieldPaper,
    onBackground = FieldInk,
    surface = Color(0xFFFAF8F2),
    onSurface = FieldInk,
    surfaceVariant = Color(0xFFE6E2D8),
    onSurfaceVariant = Quiet,
    outline = Color(0xFFD3CEC1),
    error = Color(0xFF9A3F36),
)

@Composable
fun CyberHeistTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = FieldColorScheme, content = content)
}
