// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

export enum AttributeNames {
    SESSION_ID = 'session.id',
    ENDUSER_ID = 'enduser.id',
    INDUSTRY = 'app.experience.name',
    JOURNEY = 'app.user_journey',
    STEP = 'app.workflow.step',
    OPERATION = 'app.operation.name',
    BACKEND_DOMAIN = 'app.backend.domain',
    BACKEND_RESOURCE = 'app.backend.resource',
    BACKEND_ORIGINAL_ROUTE = 'app.backend.original_route',
    AI_RESPONSE_MODE = 'app.ai.response_mode',
}
