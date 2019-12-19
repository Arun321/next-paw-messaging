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
                </span></div>
                        </div>
                    </div>


                    <div class="inbox_chat">


                        <div v-for="contact in contacts.data.messages.data" class="chat_list">
                            <div class="chat_people">
                                <div class="chat_img"><img :src="contact.media_url"></div>
                                <div class="chat_ib">
                                    <h5>{{contact.first_name}} </h5>
                                    <p>{{ contact.body.trunc(30) }}<span class="chat_date">{{ format_date(contact.message_created_at) }}</span></p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div class="mesgs">
                    <div class="msg_history">
                        <div v-for="message in messages.data.singleConversion.data"

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

    String.prototype.trunc = String.prototype.trunc ||
        function (n) {
            return (this.length > n) ? this.substr(0, n - 1) + '....' : this;
        };

    export default {
        methods: {
            messageType: function (type, class1, class2) {
                if (type === 'fb_received') {
                    return class1;
                } else {
                    return class2;
                }
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
            }
            },

            data() {
                return {
                    token: localStorage.getItem('token'),
                    contacts: {
                        "data": {
                            "messages": {
                                "data": [
                                    {
                                        "contact_id": 15319,
                                        "first_name": "Vrushabh",
                                        "last_name": "Vora",
                                        "body": "Hi Vrushabh, Thank you for choosing Vilano Pets. Can you take 30 seconds and leave us a quick review? The link below makes it easy. \r\napp.nextpaw.com/sr/qg6GrTeMbgA6zGdf \r\nHave questions? Save our number and Text us back anytime! We are happy to help.",
                                        "media_url": "https://s3.us-west-2.amazonaws.com/nextpaw-assets/11056/HAPPY_CUSTOMER.jpg",
                                        "message_created_at": "2019-12-16 07:27:30",
                                        "deleted_at": null,
                                        "type": "invitation",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "8019907096",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 9268,
                                        "first_name": "Gabe",
                                        "last_name": null,
                                        "body": "Hi Gabe, Thank you for choosing Vilano Pets. Can you take 30 seconds and leave us a quick review? The link below makes it easy. \r\napp.nextpaw.com/sr/iWSTzNxgbPJcXitZ \r\nHave questions? Save our number and Text us back anytime! We are happy to help.",
                                        "media_url": "https://s3.us-west-2.amazonaws.com/nextpaw-assets/11056/HAPPY_CUSTOMER.jpg",
                                        "message_created_at": "2019-12-15 13:52:16",
                                        "deleted_at": null,
                                        "type": "invitation",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "6093396808",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 30811,
                                        "first_name": "Ben",
                                        "last_name": null,
                                        "body": "Hi Ben, Thank you for choosing Vilano Pets. Can you take 30 seconds and leave us a quick review? The link below makes it easy. \r\napp.nextpaw.com/sr/Ciu7dYT3PowQAfIA \r\nHave questions? Save our number and Text us back anytime! We are happy to help.",
                                        "media_url": "https://s3.us-west-2.amazonaws.com/nextpaw-assets/11056/HAPPY_CUSTOMER.jpg",
                                        "message_created_at": "2019-12-12 16:31:42",
                                        "deleted_at": null,
                                        "type": "invitation",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "8012057914",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 34550,
                                        "first_name": "Jerry",
                                        "last_name": null,
                                        "body": "Www.qwerty.com",
                                        "media_url": null,
                                        "message_created_at": "2019-12-13 19:36:41",
                                        "deleted_at": null,
                                        "type": "sent",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "7173149292",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 35216,
                                        "first_name": "Kelly",
                                        "last_name": null,
                                        "body": "Thanks for reaching out to Vilano Pets. We have received your message and will respond to you shortly. For a faster response, call (385) 555-5555 if you'd like to talk with us now.",
                                        "media_url": null,
                                        "message_created_at": "2019-12-13 17:54:21",
                                        "deleted_at": null,
                                        "type": "sent",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "7017408611",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 35217,
                                        "first_name": "Joel",
                                        "last_name": null,
                                        "body": "😁",
                                        "media_url": null,
                                        "message_created_at": "2019-12-13 17:50:16",
                                        "deleted_at": null,
                                        "type": "sent",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "6124628203",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    },
                                    {
                                        "contact_id": 35217,
                                        "first_name": "Joel",
                                        "last_name": null,
                                        "body": "😁",
                                        "media_url": null,
                                        "message_created_at": "2019-12-13 17:50:16",
                                        "deleted_at": null,
                                        "type": "sent",
                                        "status": "SENT",
                                        "sender": "2157097384",
                                        "receiver": "6124628203",
                                        "ps_id": null,
                                        "unread_message_count": 0
                                    }
                                ],
                                "total": 213,
                                "per_page": 10
                            }
                        }
                    },


                    messages: {
                        "data": {
                            "singleConversion": {
                                "data": [
                                    {
                                        "id": 38795,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Ok thanks!",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "2428886103852853",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_received",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 18:07:34"
                                    },
                                    {
                                        "id": 38794,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Thank you for your interest in NextPaw! Unfortunately, our software isn't available for Canadian customers, but we are looking into expanding. Hopefully, not much longer 🤞",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "435816710114410",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_send",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 17:48:51"
                                    },
                                    {
                                        "id": 38741,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Do you work with Canadian companies?",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "2428886103852853",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_received",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 01:23:59"
                                    },
                                    {
                                        "id": 38741,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Do you work with Canadian companies?",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "2428886103852853",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_received",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 01:23:59"
                                    },
                                    {
                                        "id": 38741,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Do you work with Canadian companies?",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "2428886103852853",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_received",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 01:23:59"
                                    },
                                    {
                                        "id": 38741,
                                        "first_name": "Carly",
                                        "last_name": "Patryluk",
                                        "contact_id": 7574,
                                        "body": "Do you work with Canadian companies?",
                                        "media_url": null,
                                        "receiver": "435816710114410",
                                        "sender": "2428886103852853",
                                        "contact_created_at": "2019-05-23 01:23:59",
                                        "type": "fb_send",
                                        "status": "SENT",
                                        "archived": 0,
                                        "message_created_at": "2019-05-23 01:23:59"
                                    }
                                ],
                                "total": 3,
                                "per_page": 10
                            }
                        }
                    },

                    data:{
                        results:[]
                    }

                }


            }, mounted() {
               // console.log('Component mounted.')
            axios.post("https://app.nextpaw.com/graph-api")
                .then(response => {this.results = response.data.results}).then(data => {



            })
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

