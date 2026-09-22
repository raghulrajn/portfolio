# Portfolio

Personal portfolio site for Raghul Raj Navaneethakrishnan — C++ / GPU engineering, CUDA & OpenCL kernels,
and applied deep learning. Plain HTML/CSS/JS, no build step.

## Local preview

Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this repo to `main` on GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. The site will be published at `https://raghulrajn.github.io/portfolio/`.

## Structure

- `index.html` — page content
- `style.css` — design tokens, layout, animations (auto dark/light theme)
- `script.js` — theme toggle, scroll reveal, typed text, particle background, skill filters
- `Raghul_Raj_CV.pdf` — downloadable CV (linked from the hero section)
