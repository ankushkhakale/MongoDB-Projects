def validate_session(data):
    """
    Validates the incoming payload for a study session.
    Raises ValueError if validation fails.
    """
    topic = data.get("topic")
    duration = data.get("duration")
    focus_level = data.get("focus")

    if not topic or not isinstance(topic, str) or len(topic.strip()) == 0:
        raise ValueError("Topic must be a non-empty string.")

    try:
        duration = int(duration)
        if duration < 1 or duration > 600:
            raise ValueError("Duration must be an integer between 1 and 600 minutes.")
    except (TypeError, ValueError):
        raise ValueError("Invalid duration.")

    try:
        focus_level = int(focus_level)
        if focus_level < 1 or focus_level > 5:
            raise ValueError("Focus level must be an integer between 1 and 5.")
    except (TypeError, ValueError):
        raise ValueError("Invalid focus level.")

    return {
        "topic": topic.strip(),
        "duration": duration,
        "focus_level": focus_level
    }
