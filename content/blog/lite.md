+++
title = "lite.ily.rs"
date = 2026-07-02
+++

I've just got around to setting up a mirror of this site over at <a href="https://lite.ily.rs">lite.ily.rs</a>. It's a text-only version of the site with no JavaScript and more or less zero CSS.

It was far easier to set up (and maintain) than I envisioned. I made a <mark>lite config</mark> for Zola which is pretty much identical to my standard config, except it has an extra bit of metadata saying that `lite` is true; and everywhere that the sites need to diverge there's an if-else checking if we're currently lite or not.

My images are all in shortcodes already so they all got changed in one place. On the main site I have some basic setting of lazy loading, resizing and converting to webp, and adding a figcaption in place. For the lite version of the site, all of that is replaced with an anchor link directly to the image.

Besides the images, it was just a case of deciding what should change structurally to place less reliance on styling. Rather than styled dd/dt elements, a few places become paragraphs with line-breaks, for example.

Here's my image shortcode after the change.

If we're lite, link out. If we're a gif, lazy load. If we're any other kind of image, resize and convert to webp, and lazy load. If there's a caption, put it below the image.

```html
{% set alt = alt | default(value="") -%}
{% set caption = caption | default(value="") -%}
{% if config.extra.lite -%}
  <p><a href="https://ily.rs{{ page.path | safe }}{{ src }}">[image: {% if caption %}{{ caption }}{% elif alt %}{{ alt }}{% else %}{{ src }}{% endif %}]</a></p>
{%- else -%}
{% set is_gif = src is ending_with(".gif") -%}
{% set dir = page.relative_path | replace(from="index.md", to="") -%}
{% set orig = page.permalink ~ src -%}
  <figure>
    <a href="{{ orig }}">
      {%- if is_gif %}
        <img src="{{ orig }}" alt="{{ alt }}" loading="lazy">
      {%- else %}
        {%- set img = resize_image(path=dir ~ src, width=1120, op="fit_width", format="webp") %}
        <img src="{{ img.url }}" alt="{{ alt }}" loading="lazy" width="{{ img.width }}" height="{{ img.height }}">
      {%- endif %}
    </a>
    {%- if caption %}
      <figcaption>{{ caption }}</figcaption>
    {%- endif %}
  </figure>
{%- endif %}
```
