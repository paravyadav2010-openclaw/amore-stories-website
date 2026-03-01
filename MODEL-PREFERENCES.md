# Model Preferences - Dynamic Switching Setup

## ⚠️ Current Configuration

**Available Model:** `zai/glm-4.7` (full model only)

**Note:** The flash model (`zai/glm-4.7-flash`) is **not available** in this configuration. All responses use the full GLM 4.7 model with enhanced reasoning capabilities.

---

## 🎯 Current Setup

### Default Model: `zai/glm-4.7`
**Use for:** ALL tasks
- Quick questions and answers
- Complex development tasks
- Deep analysis
- Everything else

**Why:** Only model available, excellent capability for all tasks

---

## 🧠 Full Model Capabilities (Always Active)

### What `zai/glm-4.7` Handles Well:

#### 1. 🛠️ Development Tasks
- Building new applications/websites
- Writing React components
- Coding complex algorithms
- Debugging difficult issues
- API integration

#### 2. 📊 Deep Analysis
- Research projects
- Data analysis
- Complex problem-solving
- Multi-step planning
- Technical documentation

#### 3. 🧩 Complex Problem Solving
- Multiple attempts at challenging issues
- Complex edge cases
- Unexpected errors
- Debugging and troubleshooting

#### 4. 💡 Creative Work
- Long-form writing
- Creative projects
- Content creation
- Storytelling

---

## 📋 Decision Tree

```
Task Type
├── Quick Question → GLM 4.7 (zai/glm-4.7)
├── Simple Query → GLM 4.7
├── Information Lookup → GLM 4.7
├── Routine Task → GLM 4.7
├── Code Snippet → GLM 4.7
│
├── Building App → GLM 4.7
├── Debugging Issue → GLM 4.7
├── Complex Analysis → GLM 4.7
├── Long Response → GLM 4.7
├── Stuck/Unsure → GLM 4.7
│
└── All Tasks → GLM 4.7 (only model available)
```

**Note:** No model switching needed - GLM 4.7 handles everything well.

---

## 🎤 User Triggers

**Model switching not available** - GLM 4.7 is always active

All requests use the full model with enhanced reasoning capabilities. No need to specify "full model" or "flash model" - I'll use the best approach automatically.

---

## ⚙️ Session Behavior

### Default Behavior
- **Always use:** `zai/glm-4.7` (full model)
- **No switching needed:** All capabilities available
- **Automatic optimization:** I'll use appropriate reasoning depth

### Example Session Flow
```
User: "What's the weather today?"
→ GLM 4.7 (quick query, efficient) ✅

User: "Build a React website with portfolio"
→ GLM 4.7 (development task, full capability) ✅

User: "What's the capital of France?"
→ GLM 4.7 (simple query, efficient) ✅

User: "Debug this complex error code"
→ GLM 4.7 (debugging, enhanced reasoning) ✅
```

---

## 🔄 Mid-Session Behavior

**No model switching needed** - GLM 4.7 handles everything

**I'll automatically:**
- Use efficient reasoning for simple queries
- Deep dive into complex problems
- Adapt approach based on task complexity
- Provide appropriate depth for each request

---

## 📊 Model Capabilities (GLM 4.7)

| Metric | GLM 4.7 (Current) |
|--------|-------------------|
| Response Time | ~2-4s (adaptive) |
| Token Usage | Baseline |
| Cost | Full price |
| Capability | Superior for all tasks |
| Reasoning | Enhanced, adaptive |

**Adaptive Behavior:**
- Simple queries → Faster responses
- Complex tasks → Deeper reasoning
- No manual switching needed

---

## 🎯 Configuration Summary

### Available Models
- ✅ `zai/glm-4.7` - Full model (always active)
- ❌ `zai/glm-4.7-flash` - Not available in this configuration

### How I Work
- **All tasks:** Use GLM 4.7 with adaptive reasoning
- **Simple queries:** Efficient, faster responses
- **Complex tasks:** Deep analysis, enhanced reasoning
- **No switching:** One model handles everything well

---

## 🎯 Recommended Configuration

### For New Sessions (Default)
```
Model: zai/glm-4.7-flash
Reasoning: Default (or off)
Thinking: off (unless requested)
```

### For Development Sessions
```
Model: zai/glm-4.7
Reasoning: High (for complex debugging)
Thinking: On (for visibility)
```

### For Quick Chats
```
Model: zai/glm-4.7-flash
Reasoning: Off
Thinking: Off
```

---

## 💡 Best Practices

1. **Trust my judgment** - I'll use appropriate reasoning depth
2. **No model management needed** - Everything handled automatically
3. **Context preservation** - All reasoning stays within the model
4. **Monitor usage** - Check `session_status` if curious about costs
5. **Focus on task, not model** - Just tell me what you need

---

## 🔧 Implementation

### How to Get Best Results

**In your prompt:**
- Just tell me what you need
- No need to specify model
- I'll use appropriate depth automatically

**I'll respond:**
- Use GLM 4.7 with adaptive reasoning
- Match complexity to task requirements
- Provide appropriate depth for each request

**Example prompts:**
- "Quick question: What's the weather?" → Efficient response
- "Build a React app" → Full development workflow
- "Analyze this data" → Deep analysis
- "Debug this error" → Enhanced troubleshooting

---

## 📝 Summary

**Current Model:** `zai/glm-4.7` (full model - always active)  
**Availability:** Only GLM 4.7 is available in this configuration  
**Behavior:** Adaptive reasoning based on task complexity  

**Rule of thumb:** Just tell me what you need - I'll handle the rest.

---

**Last Updated:** 2026-03-01 (Updated to reflect available models only)  
**Current Session Model:** zai/glm-4.7 (full model, adaptive)  
**Status:** No model switching available - GLM 4.7 handles everything
