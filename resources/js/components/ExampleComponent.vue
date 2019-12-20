<template>
    <div class="container">
            <h3 class=" text-center">Messaging</h3>
        <div class="messaging">

            <div class="inbox_msg">
                <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="recent_heading">
                            <h4>Recent</h4>
                        </div>
                        <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input type="text" class="search-bar" placeholder="Search">
                                <span class="input-group-addon">
                                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i> </button>
                                </span>
                            </div>
                        </div>
                    </div>


                    <div class="inbox_chat" v-if="contacts.length > 0">
                        <div v-for="contact in contacts" class="chat_list">
                            <div class="chat_people" v-on:click="loadMessage(contact.contact_id)">
                                <div class="chat_img"><img :src="contact.media_url"></div>
                                <div class="chat_ib">
                                    <h5>{{contact.first_name}} {{contact.last_name}} </h5>
                                    <p>{{ trunc(contact.body) }}<span class="chat_date">{{ format_date(contact.message_created_at) }}</span></p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div class="mesgs">
                    <div class="msg_history">
                        <div v-for="message in messages"
                             :class="messageType(message.type, 'incoming_msg', 'outgoing_msg')">
                            <div :class="messageType(message.type, 'received_msg', 'sent_msg')">
                                <div :class="messageType(message.type, 'received_withd_msg', 'sent_withd_msg')">
                                    <p>{{message.body}}</p>
                                    <span class="time_date"> {{format_time_date( message.message_created_at) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="type_msg">
                        <div class="input_msg_write">

                            <input type="text" class="write_msg" placeholder="Type a message"/>
                            <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o"
                                                                          aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import moment from 'moment';
    import axios from 'axios';


    export default {
        created () {
            axios({
                url: 'https://1154558724803321-reviews.jenkins.nextpaw.com/graph-api',
                headers: {
                    Authorization: `Bearer ${this.user.token}`
                },
                method: 'POST',
                data: {
                    query: `{
    messages(clientId: 4, locationId: 3, page: 1, limit: 20){
        data{
            contact_id
            first_name
            last_name
            body
            media_url
            message_created_at
            deleted_at
            type
            status
            sender
            receiver
            ps_id
            unread_message_count
        }
        total
        per_page
    }
}`
                }
            }).then(response =>
                this.contacts = response.data.data.messages.data
            )
                .catch((e) => console.log(e))





        },
        methods: {
            messageType: function (type, class1, class2) {
                if (type === 'received') {
                    return class1;
                } else {
                    return class2;
                }
            },

            loadMessage:function(value){
                axios({
                    url: 'https://1154558724803321-reviews.jenkins.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.user.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `{
    singleConversion(id: ${value}, clientId: 4, locationId: 3, page: 1, limit: 10){
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
                }).then(response =>
                    this.messages = response.data.data.singleConversion.data
                )
                    .catch((e) => console.log(e))

            },


            format_date(value){
                if (value) {
                    return moment(String(value)).format('MM/DD/YYYY')
                }
            },

            format_time_date(value){
                if(value){
                    return moment(String(value)).format('MM/DD/YYYY | h:mm a')
                }
            },
            trunc (n) {
                return (n && n.length > 15) ? n.substr(0, 10) + '...' : n
            }
        },

        data() {
                return {
                    user: JSON.parse(localStorage.getItem('user')),
                    contacts: [],
                    messages:[],

                }


            }
    }
</script>


<style scoped>
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
        width: 40%;
        border-right: 1px solid #c4c4c4;
    }

    .inbox_msg {
        border: 1px solid #c4c4c4;
        clear: both;
        overflow: hidden;
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
        height: 550px;
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

    .messaging {
        padding: 0 0 50px 0;
    }

    .msg_history {
        height: 516px;
        overflow-y: auto;
    }

    .chat_date { font-size:13px; float:right; font-weight: bold;color: #4c4c4c;}


</style>

