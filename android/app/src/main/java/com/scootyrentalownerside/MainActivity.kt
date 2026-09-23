package com.scootyrentalownerside

import android.os.Build
import android.os.Bundle
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // Android 15+ (API 35) already forces edge-to-edge for targetSdk 35 apps.
    // Opt older Androids into the same layout so every device draws the app
    // behind the (transparent) status and navigation bars; without this,
    // pre-15 phones show the window background as a band under the nav bar
    // and report a zero bottom inset to JS.
    if (Build.VERSION.SDK_INT < 35) {
      WindowCompat.setDecorFitsSystemWindows(window, false)
    }
    // Edge-to-edge disables the framework's adjustResize, so the keyboard
    // would cover focused inputs. Re-create it: pad the content view by the
    // keyboard height whenever the IME is visible (also broken-by-default on
    // Android 15, which forces edge-to-edge for targetSdk 35 apps).
    val content = findViewById<View>(android.R.id.content)
    ViewCompat.setOnApplyWindowInsetsListener(content) { view, insets ->
      val imeBottom = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
      view.setPadding(0, 0, 0, imeBottom)
      insets
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "App"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
