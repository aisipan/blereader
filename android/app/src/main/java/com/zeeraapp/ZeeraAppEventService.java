package com.zeeraapp;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class ZeeraAppEventService extends HeadlessJsTaskService {
    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        return new HeadlessJsTaskConfig(
            "ZEERA_APP",
            extras != null ? Arguments.fromBundle(extras) : Arguments.createMap(),
            5000, // timeout for the task
            true // optional: defines whether or not  the task is allowed in foreground. Default is false
        );
    }
}