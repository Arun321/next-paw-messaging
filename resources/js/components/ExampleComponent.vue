<template>
    <div class="container">
        <h3 class=" text-center">Messaging</h3>
        <div class="messaging">
            <div style="background-color:#f8f8f8" class="header col-md-12 sticky">
                <button type="button" class="start_conversation"
                        data-toggle="modal" data-target="#myModal"><i class="fa fa-plus"
                                                                      aria-hidden="true"></i>
                </button>
                    <div class="toolbar__label current_name text-center">
                        <h4 style="text-align: right;">{{ this.activeTitle }}</h4>
                        <span class="archive-icon" v-on:click="archivedContact">
                                    <i class="fa fa-archive" aria-hidden="true"></i>
                                </span>
                    </div>

            </div>
            <div class="inbox_msg">
                <div style="width: 40%">
                    <ListContact id="1" :zeroOrOne="0" :loadMessage="loadMessage"></ListContact>
                </div>

                <div class="mesgs">
<!--                    <div class="sticky">-->
<!--                        <div class="col-md-12">-->
<!--                            <div class="toolbar__label current_name text-center">-->
<!--                                <h4>{{ this.activeTitle }}</h4>-->
<!--                                <span class="archive-icon" v-on:click="archivedContact">-->
<!--                                    <i class="fa fa-archive" aria-hidden="true"></i>-->
<!--                                </span>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
                    <div v-if="msgLoading" style="display: flex; justify-content: center; align-items: center;">
                        <i class="fa fa-circle-o-notch fa-spin" style="font-size: 45px; color: blue;"></i>
                    </div>
                    <div v-if="!msgLoading">
                        <div id="msg_history" class="msg_history">
                            <div v-for="message in messages"
                                 :class="messageType(message.type, 'incoming_msg', 'outgoing_msg')">
                                <div :class="messageType(message.type, 'received_msg', 'sent_msg')">
                                    <div :class="messageType(message.type, 'received_withd_msg', 'sent_withd_msg')">
                                        <p v-if="message.body" class="text-msg">{{message.body}}</p>
                                        <p v-if="message.media_url" class="text-img"><img v-bind:src="message.media_url" /></p>
                                        <span
                                            class="time_date"> {{format_time_date( message.message_created_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div class="type_msg" v-show="activeIndex" style="display: none">
                            <div class="input_msg_write" >
                                <input type="text" class="write_msg" placeholder="Type a message"
                                       v-model="typedMessage"/>
                                <button class="msg_send_btn" type="button" v-on:click="sendMessage">
                                    <i class="fa fa-paper-plane-o"
                                       aria-hidden="true">
                                    </i>
                                </button>
                                <input id="img_upload" type="file" v-on:change="encodeImageFileAsURL" hidden>

                                <button class="img_send_btn" id="btn_upload" type="file" v-on:click="image">
                                    <i class="fa fa-paperclip" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
                <!--          modal content  -->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <ListContact id="2"  :zeroOrOne="1"></ListContact>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import axios from 'axios';
    import ScrollLoader from 'vue-scroll-loader';
    import AddContact from "./AddContact";
    import ListContact from "./ListContact";
    import moment from 'moment';


    Vue.use(ScrollLoader)

    export default {
        components: {
            ListContact,
            AddContact
        },
        data() {
            return {
                msgLoading: false,
                contactLoading: false,
                activeIndex: 0,
                activeTitle: '',
                filter: 'all',
                page: 1,
                allContacts: [],
                filterPage: 1,
                user: JSON.parse(localStorage.getItem('user')),
                typedMessage: '',
                base64Image: '',
                messages: [],
                errors: [],
                btnUpload: '',
                myCanvas:'',
                msg: ''
            }
        },
        watch: {
            sortBy: {
                handler(n, o) {
                    this.search = ''
                }
            }
        },
        mounted() {

        },
        methods: {
            image() {
                document.getElementById('img_upload').click();
            },
            encodeImageFileAsURL(event) {
                var file = event.target.files[0];
                console.log(file.name)
                var reader = new FileReader();
                let vm = this
                reader.onloadend = function () {
                    vm.base64Image = reader.result.split(',')[1]
                }
                reader.readAsDataURL(file);
            },

            // uploadCanvasImage(){
            //     const base64 = myCanvas.toDataURL()
            //     console.log(base64)
            // },

            format_time_date(value) {
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY | h:mm a')
                }
            },
            scrollToTop() {
                var myDiv = document.getElementById('inbox_chat' + this.id);
                if (myDiv) {
                    myDiv.scrollTop = 0;
                }
            },



            scrollToEnd() {
                let container = document.querySelector('.msg_history');
                let height = container.scrollHeight;
                container.scrollTop = height;
            },

            archivedContact() {
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
                            contactArchive(id: ${this.activeIndex}, clientId: 1, locationId: 1){
                                        id
                                        first_name
                                        last_name
                                        archived
                                        error
                                        message
                                        }
                            }`
                    }
                }).then(response => {
                    this.filterPage = 1
                    this.loadMore = true
                    this.filteredContacts()
                }).catch((e) => console.log(e))
                // this.activeIndex=value

            },

            loadMessage(listContacts, value, reload) {
                if(listContacts) {
                    this.allContacts = listContacts;
                } else {
                    return false;
                }
                // console.log('test')
                this.typedMessage = '';
                if (reload == 'yes') {
                    this.msgLoading = true;
                }
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
                                 singleConversion(id: ${value}, clientId: 1, locationId: 1, page: 1, limit: 20){
                                data {
                                    id
                                    first_name
                                    last_name
                                    contact_id
                                    body
                                    media_url
                                    receiver
                                    sender
                                    contact_created_at
                                    type
                                    status
                                    archived
                                    message_created_at
                                }
                                total
                                per_page
                            }
                        }`
                    }
                }).then(response => {
                    this.msgLoading = false;
                    this.messages = response.data.data.singleConversion.data.reverse()
                    setTimeout(() => {
                        this.scrollToEnd()
                    }, 400)

                    let activeContact = listContacts.filter(function (elem) {
                        if (elem.contact_id == value) return true;
                    });
                    // if (activeContact[0].ps_id == 'null')
                    let contactNum = !activeContact[0].ps_id ? ' | ' + activeContact[0].sender : ''
                    this.activeTitle = activeContact[0].first_name + contactNum

                }).catch((e) => console.log(e));
                this.activeIndex = value;
                return value;
            },



            messageType: function (type, class1, class2) {
                if (type === 'received') {
                    return class1;
                } else {
                    return class2;
                }
            },
            sendMessage: function () {
                axios({
                    url: 'https://1146270492621681-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `mutation messageSendMutation
                        {
                            messageSendMutation(clientId: 1, locationId: 1, contactId: ${this.activeIndex}, body: "${this.typedMessage}",
                            asset_id: "${this.base64Image}", image_name: "uploadImage"
                           )
                            {
                            id
                            error
                            message
                            }
                        }`
                    }
                }).then(response => {
                    this.typedMessage = '';
                    setTimeout(() => {
                        this.loadMessage(this.allContacts, response.data.data.messageSendMutation.id, 'no');
                        this.filterPage = 1
                        this.loadMore = true
                        // this.loadAll = true
                        //this.filteredContacts()
                        setTimeout(() => {
                            this.scrollToTop()
                        }, 400)
                    }, 1000);
                    console.log(response)
                })
                    .catch(e => {
                        this.errors.push(e)
                        // this.activeIndex = value
                    })
            }
        }
    }
</script>


<style scoped>
    .header{

        border: 1px solid #b6b6b6;
        border-bottom: 0;
        padding: 8px 22px;
    }
    .sticky {
        /*position: -webkit-sticky;*/
        /*position: sticky;*/
        top: 0;
        padding: 5px;
        /*background-color: #cae8ca;*/
        /*border: 2px solid #c4c4c4;*/
    }

    /*.archive-icon {*/
    /*    position: absolute;*/
    /*    right: 0;*/
    /*    font-size: 25px;*/
    /*    margin-top: -10px;*/
    /*}*/

    /*.archive-img {*/
    /*    position: absolute;*/
    /*    width: 24px;*/
    /*    right: 0;*/
    /*    top: 5px;*/
    /*}*/

    .fa-archive {
        position: absolute;
        width: 24px;
        font-size: 18px;
        right: 0;
        top: 5px;
    }

    .container {
        max-width: 1170px;
        margin: auto;
    }

    img {
        max-width: 100%;
    }

    .inbox_people {
        background: #f8f8f8 none repeat scroll 0 0;
        float: left;
        overflow: hidden;
        width: 100%;
        border-right: 1px solid #c4c4c4;
    }

    .inbox_msg {
        border: 1px solid #c4c4c4;
        clear: both;
        overflow: hidden;
        border-top: 0;
    }

    .top_spac {
        margin: 20px 0 0;
    }


    .recent_heading {
        float: left;
        width: 40%;
    }

    .srch_bar {
        display: inline-block;
        text-align: right;
        width: 60%;
        padding: 0;
        outline: 0;
    }

    .headind_srch {
        padding: 10px 29px 10px 20px;
        overflow: hidden;
        border-bottom: 1px solid #c4c4c4;
    }

    .recent_heading h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;
    }

    .srch_bar input {
        border: 1px solid #cdcdcd;
        border-width: 0 0 1px 0;
        width: 80%;
        padding: 2px 0 4px 6px;
        background: none;
        outline: 0;
    }

    .srch_bar .input-group-addon button {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        padding: 0;
        color: #707070;
        font-size: 18px;
        outline: 0;
    }

    .srch_bar .input-group-addon {
        margin: 0 0 0 -27px;
    }

    .chat_ib h5 {
        font-size: 15px;
        color: #464646;
        margin: 0 0 8px 0;
    }

    .chat_ib h5 span {
        font-size: 13px;
        float: right;
    }

    .chat_ib p {
        font-size: 14px;
        color: #989898;
        margin: auto
    }

    .chat_img {
        float: left;
        width: 11%;
    }

    .chat_ib {
        float: left;
        padding: 0 0 0 15px;
        width: 88%;
    }

    .chat_people {
        overflow: hidden;
        color: white;
        clear: both;
        overflow: scroll;
    }

    .chat_list {
        border-bottom: 1px solid #c4c4c4;
        margin: 0;
        padding: 18px 16px 10px;
        overflow-y: scroll;
    }

    .inbox_chat {
        scroll-behavior: smooth;
        max-height: 520px;
        overflow-y: scroll;
    }

    .active_chat {
        background: #ebebeb;
    }

    .incoming_msg_img {
        display: inline-block;
        width: 6%;
    }

    .received_msg {
        display: inline-block;
        padding: 0 0 0 10px;
        vertical-align: top;
        width: 92%;
    }

    .received_withd_msg p {
        background: #ebebeb none repeat scroll 0 0;
        border-radius: 3px;
        color: #646464;
        font-size: 14px;
        margin: 0;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .time_date {
        color: #747474;
        display: block;
        font-size: 12px;
        margin: 8px 0 0;
    }

    .received_withd_msg {
        width: 57%;
    }

    .mesgs {
        border-left: 1px solid #c4c4c4;
        float: left;
        padding: 30px 15px 0 25px;
        width: 60%;
    }

    .sent_msg p {
        background: #05728f none repeat scroll 0 0;
        border-radius: 3px;
        font-size: 14px;
        margin: 0;
        color: #fff;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .outgoing_msg {
        overflow: hidden;
        margin: 26px 0 26px;
    }

    .sent_msg {
        float: right;
        width: 46%;
    }

    .input_msg_write input {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        color: #4c4c4c;
        font-size: 15px;
        min-height: 48px;
        width: 100%;
        outline: 0;
    }

    .type_msg {
        border-top: 1px solid #c4c4c4;
        position: relative;
    }

    .msg_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 33px;
    }

    .img_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 40px;
        top: 11px;
        width: 33px;
    }

    .messaging {
        padding: 0 0 50px 0;
    }

    .msg_history {
        height: 516px;
        overflow-y: scroll;
    }

    .chat_date {
        font-size: 13px;
        float: right;
        font-weight: bold;
        color: #4c4c4c;
    }

    .archive {
        font-size: 13px;
        float: right;
        font-weight: bold;
        color: #4c4c4c;
    }

    .active {
        background-color: aliceblue;
    }

</style>

