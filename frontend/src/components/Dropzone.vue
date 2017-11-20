<template>
  <form class="dropzone">
    <!-- Not displayed, just for Dropzone's `dictDefaultMessage` option -->
    <div id="dropzone-message" style="display: none">
      <span class="dropzone-title">파일선택</span>
      <span class="dropzone-info">3MB 이하</span>
    </div>
    <div v-if="fileToUpload">
      <b-btn size="sm" variant="primary" @click="uploadFile">전송</b-btn>
      <b-btn size="sm" variant="danger" @click="removeFile">취소</b-btn>
    </div>
  </form>
</template>

<script>
import Dropzone from 'dropzone'
import '../../node_modules/dropzone/dist/dropzone.css'
import lambda from '../services/LambdaService'

Dropzone.autoDiscover = false

export default {
  name: 'dropzone',

  props: ['clickSave'],

  watch: {
    clickSave (value) {
      if (value) {
        this.uploadFile()
      }
    }
  },

  data () {
    return {
      key: null,
      accessUrl: null,
      options: {
        // The URL will be changed for each new file being processing
        url: '/',
        method: 'put',
        maxFilesize: 3,
        maxFiles: 1,

        // resizeWidth: 800,
        // resizeHeight: 600,
        // resizeMimeType: 'image/jpeg',
        // resizeMethod: 'contain',
        // resizeQuality: 0.2,

        // Since we're going to do a `PUT` upload to S3 directly
        // Hijack the xhr.send since Dropzone always upload file by using formData
        // ref: https://github.com/danialfarid/ng-file-upload/issues/743
        sending (file, xhr) {
          let _send = xhr.send
          xhr.send = () => {
            _send.call(xhr, file)
          }
        },
        // Upload one file at a time since we're using the S3 pre-signed URL scenario
        parallelUploads: 1,
        uploadMultiple: false,
        // Content-Type should be included, otherwise you'll get a signature
        // mismatch error from S3. We're going to update this for each file.
        header: '',
        // Customize the wording
        // dictDefaultMessage: document.querySelector('#dropzone-message').innerHTML,
        // We're going to process each file manually (see `accept` below)
        autoProcessQueue: false,
        acceptedFiles: 'image/*',
        // Here we request a signed upload URL when a file being accepted
        accept (file, done) {
          lambda.getSignedURL(file)
            .then(({ url, key, accessUrl }) => {
              file.key = key
              file.accessUrl = accessUrl

              file.uploadURL = url
              done()

              // Manually process each file
              // setTimeout(() => this.dropzone.processFile(file))
            })
            .catch((err) => {
              done('Failed to get an S3 signed upload URL', err)
            })
        }
      },
      fileToUpload: false
    }
  },

  mounted () {
    this.options.dictDefaultMessage = document.querySelector('#dropzone-message').innerHTML
    // Instantiate Dropzone
    this.dropzone = new Dropzone(this.$el, this.options)
    // Set signed upload URL for each file
    this.dropzone.on('addedfile', (file) => {
      this.fileToUpload = true
    })

    this.dropzone.on('removedfile', (file) => {
      this.fileToUpload = false
    })

    this.dropzone.on('processing', (file) => {
      this.dropzone.options.url = file.uploadURL
    })

    this.dropzone.on('complete', (file) => {
      this.dropzone.removeFile(file)
      this.$emit('complete', { file_name: file.key, access_url: file.accessUrl })
    })
  },

  methods: {
    uploadFile () {
      const files = this.dropzone.getQueuedFiles()

      files.forEach((file) => {
        this.dropzone.processFile(file)
      })
    },

    removeFile () {
      this.dropzone.removeAllFiles()
    }
  }
}
</script>

<style>
form.dropzone {
	transition: all 0.2s linear;
	border: 2px dashed #ccc;
	background-color: #fafafa;
	min-height: initial;
}

form.dropzone:hover {
	border-color: #3498db;
	background-color: #fff;
}

form.dropzone:hover .dz-message .dropzone-title {
	color: #3498db;
}

form.dropzone .dz-message {
	color: #666;
}

form.dropzone .dz-message span {
	line-height: 1.8;
	font-size: 13px;
	letter-spacing: 0.4px;
}

form.dropzone .dz-message span span.dropzone-title {
	display: block;
	color: #888;
	font-size: 1.25em;
}

form.dropzone .dz-message span span.dropzone-info {
	display: block;
	color: #a8a8a8;
}
</style>
