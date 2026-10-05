# Drop raw downloads here

Save the files from Pixabay into this folder **without renaming them**. Their
original names contain the photo id, which is how `scripts/prepare-images.py`
knows which slot each one belongs to.

Then, from the repo root:

```bash
python scripts/prepare-images.py --dry-run   # see what it would do
python scripts/prepare-images.py             # actually write the files
```

It crops each image to the right aspect ratio, resizes it, and writes it out as WebP
under the correct name in `coffee/`, `equipment/` or `editorial/`.

This folder is working material — nothing here is served. Delete it once the
prepared files are in place.
