# GitHub Actions - Sort Markdown links

## Example usage

Add `<!--START_SECTION:links-->` and `<!--END_SECTION:links->` where you would like your table to appear in your README.

```yaml
jobs:
  table:
    runs-on: ubuntu-latest
    name: Sort Links
    steps:
    - uses: actions/checkout@v2
    - name: Read/Write data into README
      uses: allanregush/gh-actions-sort-markdown-links
      with:
        md-file-path: 'readme.md'
        github-token: ${{ secrets.GITHUB_TOKEN }}
```