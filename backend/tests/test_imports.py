
try:
    import deep_translator
    print("deep_translator: OK")
except ImportError:
    print("deep_translator: MISSING")

try:
    import google.generativeai as genai
    print("google-generativeai: OK")
except ImportError:
    print("google-generativeai: MISSING")
