# AI Research Roadmap

[English](README.md) | [中文](README_ZH.md)

> **Insight into paper context, deduction of technical future.**
> This project is an automated technology evolution tracking tool. By integrating arXiv and Semantic Scholar data sources and utilizing Large Language Models (LLM) to deeply analyze paper content, it generates visualized technology evolution roadmaps, assisting researchers in quickly clarifying domain contexts from vast literature and predicting future directions.

---

## 🌟 Core Features

* **Multi-source Paper Retrieval**: Integrates **arXiv** and **Semantic Scholar** APIs to accurately cover mainstream academic resources.
* **Key Content Extraction**: Utilizes LLMs to structurally extract core contributions and technical points of papers, eliminating tedious initial screening of original texts.
* **Technology Evolution Roadmap Generation**: Based on long-context summarization technology, it connects key papers in a specific field chronologically, automatically generating technology evolution logic.
* **Future Trend Deduction**: Based on existing technology paths, it uses LLMs for deep speculation, predicting potential future research hotspots and evolution directions in the field.
* **Interactive Web Interface**: Intuitive display pages supporting targeted analysis and archive management by domain or evaluation task (such as SWE-bench).

---

## 🛠️ Technical Architecture

* **Data Layer**: arXiv API, Semantic Scholar API
* **Model Layer**: LLM (such as GPT-4, Claude, etc.) responsible for extraction, summarization, and deduction
* **Processing Layer**: Long-context Summarization workflow
* **Frontend Display**: Web-based interactive dashboard

---

## 📂 Project Demo

> [Place your Web page screenshots here, e.g., timeline display charts, LLM-generated evolution route reports, etc.]

### Typical Use Case: SWE-bench Evolution Analysis

1. **Input Keyword**: `SWE-bench`
2. **Retrieval**: Automatically crawls relevant evaluation tasks and optimization papers.
3. **Analysis**: Extracts core improvements of models in each stage regarding Agent orchestration and environment interaction.
4. **Generate Report**: Displays the complete evolution logic from benchmark release to current SOTA models and future trend predictions.

---

## 📅 Roadmap

* [ ] Support more paper databases (such as ACL, IEEE).
* [ ] Optimize long-context summarization algorithms to reduce token consumption and improve accuracy.
* [ ] Add Multi-agent collaborative deduction mode.
* [ ] Export function (PDF/Markdown/PPTX).

---

## 🤝 Contribution and Feedback

Issues and Pull Requests are welcome to improve this project. If you find this tool helpful, please give it a ⭐️ for encouragement!
