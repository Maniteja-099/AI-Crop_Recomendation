# 📊 Agri-AI Backend Test Report

**Date:** 2026-02-14 20:24:54
**Overall Status:** ✅ PASSED

## 🏁 Summary

| Test Module | Status | Details |
|-------------|--------|---------|
| tests/test_prediction_service.py | ✅ PASS | [View Logs](#teststest_prediction_servicepy) |
| tests/test_chatbot_service.py | ✅ PASS | [View Logs](#teststest_chatbot_servicepy) |
| tests/test_api.py | ✅ PASS | [View Logs](#teststest_apipy) |

## 📝 Detailed Logs

### tests/test_prediction_service.py
```text
============================= test session starts =============================
platform win32 -- Python 3.13.4, pytest-9.0.2, pluggy-1.6.0 -- C:\Users\udvik\AppData\Local\Programs\Python\Python313\python.exe
cachedir: .pytest_cache
rootdir: E:\MiniProject\backend
plugins: anyio-4.9.0, Faker-40.1.2, hydra-core-1.3.2, langsmith-0.3.33, asyncio-1.3.0, cov-7.0.0, mock-3.15.1
asyncio: mode=Mode.STRICT, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 7 items

tests/test_prediction_service.py::test_soil_fertility_low PASSED         [ 14%]
tests/test_prediction_service.py::test_soil_fertility_high PASSED        [ 28%]
tests/test_prediction_service.py::test_weather_risk_detection PASSED     [ 42%]
tests/test_prediction_service.py::test_weather_risk_extreme PASSED       [ 57%]
tests/test_prediction_service.py::test_crop_recommendation_rice PASSED   [ 71%]
tests/test_prediction_service.py::test_yield_prediction PASSED           [ 85%]
tests/test_prediction_service.py::test_fertilizer_recommendation_urea PASSED [100%]

============================== warnings summary ===============================
tests/test_prediction_service.py::test_soil_fertility_low
  C:\Users\udvik\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\base.py:380: InconsistentVersionWarning: Trying to unpickle estimator DecisionTreeRegressor from version 1.8.0 when using version 1.6.1. This might lead to breaking code or invalid results. Use at your own risk. For more info please refer to:
  https://scikit-learn.org/stable/model_persistence.html#security-maintainability-limitations
    warnings.warn(

tests/test_prediction_service.py::test_soil_fertility_low
  C:\Users\udvik\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\base.py:380: InconsistentVersionWarning: Trying to unpickle estimator RandomForestRegressor from version 1.8.0 when using version 1.6.1. This might lead to breaking code or invalid results. Use at your own risk. For more info please refer to:
  https://scikit-learn.org/stable/model_persistence.html#security-maintainability-limitations
    warnings.warn(

tests/test_prediction_service.py::test_crop_recommendation_rice
  C:\Users\udvik\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but RandomForestClassifier was fitted with feature names
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 7 passed, 3 warnings in 3.22s ========================
```

### tests/test_chatbot_service.py
```text
============================= test session starts =============================
platform win32 -- Python 3.13.4, pytest-9.0.2, pluggy-1.6.0 -- C:\Users\udvik\AppData\Local\Programs\Python\Python313\python.exe
cachedir: .pytest_cache
rootdir: E:\MiniProject\backend
plugins: anyio-4.9.0, Faker-40.1.2, hydra-core-1.3.2, langsmith-0.3.33, asyncio-1.3.0, cov-7.0.0, mock-3.15.1
asyncio: mode=Mode.STRICT, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 5 items

tests/test_chatbot_service.py::test_greeting_en PASSED                   [ 20%]
tests/test_chatbot_service.py::test_soil_query_hi PASSED                 [ 40%]
tests/test_chatbot_service.py::test_crop_query_te PASSED                 [ 60%]
tests/test_chatbot_service.py::test_strip_emojis PASSED                  [ 80%]
tests/test_chatbot_service.py::test_intent_detection PASSED              [100%]

============================== 5 passed in 0.24s ==============================
```

### tests/test_api.py
```text
============================= test session starts =============================
platform win32 -- Python 3.13.4, pytest-9.0.2, pluggy-1.6.0 -- C:\Users\udvik\AppData\Local\Programs\Python\Python313\python.exe
cachedir: .pytest_cache
rootdir: E:\MiniProject\backend
plugins: anyio-4.9.0, Faker-40.1.2, hydra-core-1.3.2, langsmith-0.3.33, asyncio-1.3.0, cov-7.0.0, mock-3.15.1
asyncio: mode=Mode.STRICT, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 6 items

tests/test_api.py::test_root PASSED                                      [ 16%]
tests/test_api.py::test_health PASSED                                    [ 33%]
tests/test_api.py::test_soil_fertility_api PASSED                        [ 50%]
tests/test_api.py::test_full_report_api PASSED                           [ 66%]
tests/test_api.py::test_chatbot_api PASSED                               [ 83%]
tests/test_api.py::test_input_validation_failure PASSED                  [100%]

============================== warnings summary ===============================
tests/test_api.py::test_full_report_api
  C:\Users\udvik\AppData\Local\Programs\Python\Python313\Lib\site-packages\sklearn\utils\validation.py:2739: UserWarning: X does not have valid feature names, but RandomForestClassifier was fitted with feature names
    warnings.warn(

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 6 passed, 1 warning in 2.65s =========================
```

