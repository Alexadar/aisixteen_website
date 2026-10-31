// 3. Agents — pillar page. Published. Overview + one clip (reused from Context folding)
// + the list of its articles, which the page adds from registry.json.
import { src } from '../lib.js'

export default {
  headline: 'The agents Aisixteen Fantastic ships',
  description: 'The agents that ship with Aisixteen Fantastic, grouped by what they do: AI agents over several model backends, memory stores, credentials, IO legs for files, processes, the web, other kernels and MCP servers, program agents, kernel services such as the scheduler and the static loader, and role-based spawning.',
  summary: 'The agents fantastic ships, grouped by what they do: the AI agent and its memory, credentials, IO legs for files, commands, the web, other kernels and MCP, program agents, kernel services and team spawning.',
  cover: { clip: 'fold', from: 'agents_ai_agent_context_folding' },
  about: ['Aisixteen Fantastic', 'AI agents', 'LLM tools', 'Agent memory'],
  lead: [
    'Everything in Fantastic is an agent, so what it can do is the set of agents it ships. Each is a bundle that answers its own verbs behind the same call gate.',
  ],
  sections: [
    {
      id: 'overview',
      title: 'What ships',
      blocks: [
        { list: [
          '**AI agents** over vLLM, Ollama, the OpenAI Responses API and Anthropic’s Messages API, plus Apple’s on-device model on macOS. Tool calling is Fantastic’s own prompt-taught `<call>` grammar, not a provider tool API, so any capable model drives the same verbs. [AI agent](/fantastic/foundations/agents/ai-agent/) follows one turn, and [Model backends](/fantastic/foundations/agents/ai-agent/backends/) the five providers.',
          '**Memory**: every message lives in a [memory store](/fantastic/foundations/agents/memory-stores/) agent. AI agents fold, recall and page their own history.',
          '**IO legs**: the [file agent](/fantastic/foundations/agents/file/) (`file_bridge`) for files, edits, streams and watches; the [exec bridge](/fantastic/foundations/agents/exec-bridge/) for allowlisted commands, terminals and a control wire back to the kernel; the [web host](/fantastic/foundations/agents/web/) with its `web_ws` and `web_rest` legs for the browser and HTTP; the [bridge](/fantastic/foundations/agents/bridge/) (`ws_bridge`) from one kernel to another; and the [MCP client](/fantastic/foundations/agents/mcp-client/) for a remote MCP server’s tools as verbs.',
          '**Programs**: a [program agent](/fantastic/foundations/agents/program-agents/) is a process that answers its folder bundle’s verbs over the exec bridge’s control wire.',
          '**Kernel services**: the [scheduler](/fantastic/foundations/agents/scheduler/) for recurring sends, the [static loader](/fantastic/foundations/agents/static-loader/) for a roster declared in `fantastic.yaml`, and [credentials by reference](/fantastic/foundations/agents/credential-store/), with keys bound to one host.',
          '**Teams**: [agentic resources and tasks](/fantastic/foundations/agents/agentic-resources/) spawn agents from role cards under limits and record who holds each task. Both are off by default.',
        ] },
        'The AI agent keeps a long conversation in a finite window by folding it: a finished stretch of work becomes one appended row that names what it hides.',
        { video: 'fold', from: 'agents_ai_agent_context_folding' },
      ],
    },
  ],
  sources: [
    ['README.md: what’s in the box', src('README.md', 49)],
    ['README.md: memory', src('README.md', 47)],
    ['ai_core (Python)', src('src/lib/python/bundled_agents/ai/ai_core/src/ai_core')],
  ],
}
