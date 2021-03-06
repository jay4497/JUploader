String.prototype.rtrim = function (c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('([' + c + ']*$)', 'gi');
    return this.replace(reg, '');
}

var JUploader = {
    settings: {
        'origin_input': '#thumbnail',
        'url': 'upload.php'
    },
    init: function(options){
        var options = options || this.settings;

        var overlay = $('<div class="j-uploader-overlay"></div>'),
            modal = $('<div class="j-uploader-modal panel panel-primary"></div>'),
            modal_title = $('<div class="panel-heading">上传图片</div>'),
            modal_body = $('<div class="panel-body"></div>');
            modal_footer = $('<div class="panel-footer">'
                        + '<button id="j-uploader-complete" class="pull-right btn btn-primary">确 定</button>'
                        + '<button id="j-uploader-cancel" class="pull-right btn btn-primary">取 消</button>'
                        + '<div class="clearfix"></div>'
                        + '</div>'),
            buttons = $('<div class="j-uploader-buttons">'
                        + '<button id="j-uploader-upload-picker" class="btn btn-default">选择图片</button>&nbsp;'
                        + '<button id="j-uploader-upload-btn" class="btn btn-primary">上 传</button>' + 
                        '</div>'),
            preview = $('<div class="j-uploader-preview" id="j-uploader-files"></div>'),
            origin_input = $('<input type="hidden" name="j-uploader-origin-input" id="j-uploader-origin-input">'),
            result_input = $('<input type="hidden" name="j-uploader-input" id="j-uploader-input">');

        modal_body.append(buttons);
        modal_body.append(preview);
        modal.append(modal_title);
        modal.append(modal_body);
        modal.append(modal_footer);
        overlay.append(modal);
        overlay.append(origin_input);
        overlay.append(result_input);
        $('body').append(overlay);

        var state = 'pending';
        // var filelist = $('#j-uploader-files');
        var uploader = WebUploader.create({
                        // swf文件路径
                        //swf: '/js/Uploader.swf',
                        // 文件接收服务端。
                        server: options.url,
                        // 选择文件的按钮。可选。
                        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                        pick: '#j-uploader-upload-picker',
                        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                        resize: false
                        });
                
        // 当有文件被添加进队列的时候
        uploader.on( 'fileQueued', function( file ) {
            var $li = $(
                '<div class="col-xs-3">' + 
                '<div id="' + file.id + '" class="j-uploader-file-item thumbnail">' +
                    '<p class="j-uploader-file-status">等待上传</p>' + 
                    '<img>' +
                    '<p>' + file.name + '</p>' +
                '</div></div>'
                ),
            $img = $li.find('img');

            $li.on('mouseenter', function(){
                $(this).find('.j-uploader-file-status').css('cursor', 'pointer');
                $(this).find('.j-uploader-file-status').html('删 除');
            });

            $li.on('click', '.j-uploader-file-status', function(){
                uploader.removeFile(file, true);
                $(this).parent().parent().remove();
            });

            // $list为容器jQuery实例
            preview.append( $li );

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            });

            /**
            filelist.append( '<div id="' + file.id + '" class="thumbnail">' +
                '<h4 class="info">' + file.name + '</h4>' +
                '<p class="state">等待上传...</p>' +
            '</div>' );
            */
        });

        uploader.on( 'uploadSuccess', function(file, data) {
            var pre_val = $('#j-uploader-input').val();
            $('#j-uploader-input').val(pre_val + data.path + ',');
            $( '#'+file.id ).find('p.j-uploader-file-status').text('已上传');
        });

        uploader.on( 'uploadError', function( file ) {
            $( '#'+file.id ).find('p.j-uploader-file-status').text('上传出错');
        });

        uploader.on( 'all', function( type ) {
            if ( type === 'startUpload' ) {
                state = 'uploading';
            } else if ( type === 'stopUpload' ) {
                state = 'paused';
            } else if ( type === 'uploadFinished' ) {
                state = 'done';
            }
        });

        buttons.find('#j-uploader-upload-btn').on('click', function(){
            //$('#file-list').html('go upload');
            console.log('click to upload.');
            uploader.upload();
        });

        modal_footer.find('#j-uploader-complete').on('click', function(){
            var result = $('#j-uploader-input').val();
            result = result.rtrim(',');
            $(options.origin_input).val(result);
            $('.j-uploader-overlay').fadeOut('fast', function(){
                $('.j-uploader-overlay').remove();
            });
        });
        modal_footer.find('#j-uploader-cancel').on('click', function(){
            $('.j-uploader-overlay').fadeOut('fast', function(){
                $('.j-uploader-overlay').remove();
            });
        });
    }
};