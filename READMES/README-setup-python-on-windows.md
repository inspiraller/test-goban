# Setting up python on windows
Tweaks to README
```sh
python --version
deactivate
python -m venv venv
source venv/Scripts/activate
```

# Install
```sh
pip install -r requirements.txt
```

# Run tests
```sh
export PYTHONPATH=$(pwd)
# python -m unittest tests.test_goban.py
pytest .
```
