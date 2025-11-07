import regex
import emoji
import numpy as np
import pandas as pd
import plotly.express as px
from collections import Counter
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

class WhatsAppChatAnalysis:
    """
    To dip dive into analysis of WhatApp Chat
    """
    def __init__(self):
        # Regex pattern for WhatsApp version 2.21.11.15
        self.pattern = '^\[([0-9]+)(\/)([0-9]+)(\/)([0-9]+), ([0-9]+):([0-9]+):([0-9]+)[ ]?(AM|PM|am|pm)?\]'
        
    def parse_date_time(self,string):
        """Parse the Date and Time with regex match"""
        if regex.match(self.pattern, string):
            return True
        return False
    
    def find_author(self,string):
        """Find the Author in String"""
        if len(string.split(":",1)) == 2:
            return True
        else:
            return False
        
    def parse_message(self,line):
        """ Parse the raw message into chunks"""
        splitline, split_message = line.split(']')
        splitdate, splittime = splitline.split(",")
        date = splitdate.strip('[')
        time = splittime.strip()
        message = split_message.strip()
        if self.find_author(message):
            splitmessage = message.split(":",1)
            author = splitmessage[0]
            message = " ".join(splitmessage[1:])
        else:
            author= None
        return date, time, author, message
    
    def process_chat(self,exported_chat):
        """ Process the export file from whatsapp"""
        data = []
        with open(exported_chat, encoding="utf-8") as fp:
            fp.readline()
            messageBuffer = []
            date, time, author = None, None, None
            while True:
                line = fp.readline()
                if not line:
                    break
                line = line.strip()
                if self.parse_date_time(line):
                    if len(messageBuffer) > 0:
                        data.append([date, time, author, ''.join(messageBuffer)])
                    messageBuffer.clear()
                    date, time, author,message = self.parse_message(line)
                    messageBuffer.append(message)
                else:
                    messageBuffer.append(line)
        return data
    
    def extract_emojis(self, s):
        """Extract emojis from message string"""
        return ''.join(c for c in s if c in emoji.UNICODE_EMOJI['en'])
    
    def generate_word_cloud(self,text):
        """Generate Word Cloud"""
        print ("There are {} words in all the messages.".format(len(text)))
        stopwords = set(STOPWORDS)
        # Generate a word cloud image
        wordcloud = WordCloud(stopwords=stopwords, background_color="white").generate(text)
        # Display the generated image:
        # the matplotlib way:
        plt.figure( figsize=(10,5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis("off")
        plt.show()
        
    def emoji_pie_chat(self, emoji_df):
        """Generate Pie chat for Emojis Dataframe"""
        fig = px.pie(emoji_df, values='count', names='emoji')
        fig.update_traces(textposition='inside', textinfo='percent+label')
        fig.show()
        
    def generate_report(self, dataframe, media_messages_df, author):
        print(f'**** Stats of {author} *****')
        # shape will print number of rows which indirectly means the number of messages
        print('Messages Sent \t\t:', dataframe.shape[0])
        # Word_Count contains of total words in one message. Sum of all words/ Total Messages will yield words per message
        words_per_message = (np.sum(dataframe['Word_Count']))/dataframe.shape[0]
        print('Average Words/message\t:', words_per_message)
        # media conists of media messages
        media = media_messages_df[media_messages_df['Author'] == author].shape[0]
        print('Media Messages Sent\t:', media)
        # emojis conists of total emojis
        emojis = sum(dataframe['emoji'].str.len())
        print('Total Emojis Sent \t:', emojis)
        # links consist of total links
        links = sum(dataframe["urlcount"])   
        print('Total Links Share \t:', links)
        print("*"*45)
        
import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))
        
# Initiate Class Instance
chat = WhatsAppChatAnalysis()
# Call Process chat with input as exported file
data = chat.process_chat('/kaggle/input/whatsapp-chat-dataset/whatsapp_chat.txt')

df = pd.DataFrame(data, columns=["Date", 'Time', 'Author', 'Message'])

df.tail(5)

df.describe()

df['Date'] = pd.to_datetime(df['Date'])

df['emoji'] = df["Message"].apply(chat.extract_emojis)
emojis = sum(df['emoji'].str.len())
print("Total Emoji's Used : ", emojis)

#print(df.tail(20))
print(df.info())
print(df.Author.unique())

total_messages = df.shape[0]
print(total_messages)

len(df[df['Message'].str.contains("image omitted")])

URLPATTERN = r'(https?://\S+)'
df['urlcount'] = df.Message.apply(lambda x: regex.findall(URLPATTERN, x)).str.len()
links = np.sum(df.urlcount)

df['urlcount'].groupby(by=df['Author']).sum()

author_list = [author for author in df["Author"].unique() if author is not None ]


media_messages_df = df[df['Message'].str.contains("image omitted")]
messages_df = df.drop(media_messages_df.index)
messages_df['Letter_Count'] = messages_df['Message'].apply(lambda s : len(s))
messages_df['Word_Count'] = messages_df['Message'].apply(lambda s : len(s.split(' ')))
messages_df["MessageCount"]=1

author_list = [author for author in df["Author"].unique() if author is not None ]

for author in author_list:
    # will contain messages of only one particular user
    user_df = messages_df[messages_df["Author"] == author]
    chat.generate_report(user_df, media_messages_df, author)
    
author_list = ["person1","person5"]

# Generate Word Cloud
for i in range(len(author_list)):
    dummy_df = messages_df[messages_df['Author'] == author_list[i]]
    text = " ".join(review for review in dummy_df.Message)
    print('Words by',author_list[i])
    chat.generate_word_cloud(text)
    
total_emojis_list = list(set([a for b in messages_df.emoji for a in b]))
total_emojis = len(total_emojis_list)

total_emojis_list = list([a for b in messages_df.emoji for a in b])
emoji_dict = dict(Counter(total_emojis_list))
emoji_dict = sorted(emoji_dict.items(), key=lambda x: x[1], reverse=True)
#for i in emoji_dict:
#  print(i)

emoji_df = pd.DataFrame(emoji_dict, columns=['emoji', 'count'])
import plotly.express as px
fig = px.pie(emoji_df, values='count', names='emoji', width=800, height=700)
fig.update_traces(textposition='inside', textinfo='percent+label')
fig.show()

