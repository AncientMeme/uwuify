import re

def uwuify(text):
    # Replace 'r' and 'l' with 'w'
    text = re.sub(r'[rl]', 'w', text)
    text = re.sub(r'[RL]', 'W', text)
    
    # Add cute emoticons
    text = text.replace('!', ' uwu!')
    text = text.replace('?', ' owo?')
    
    # Replace 'n' with 'ny'
    text = re.sub(r'n([aeiou])', r'ny\1', text)
    text = re.sub(r'N([aeiou])', r'Ny\1', text)
    
    return text

input_text = "Hey! This site can help you make any old boring text nice and uwu. We can't imagine anyone would actually use this, but you gotta do what you gotta do."
uwu_text = uwuify(input_text)

print(uwu_text)