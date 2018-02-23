# 图片上传插件，基于 Webuploader 封装

### 依赖

* JQuery > 1.9

* Bootstrap 3

* Webuploader 0.1.5

### 配置及使用

**配置参数**

* `origin_input`: 返回数据的填充容器

* `url`: 对图片进行上传处理的 server 端 URL 地址

**使用**

```
JUploader.init({
    'origin_input': '#thumbnail',
    'url': 'path/to/upload.php'
});
```

DEMO 参见 `index.html`。