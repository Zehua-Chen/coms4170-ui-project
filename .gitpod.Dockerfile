FROM gitpod/workspace-full

USER gitpod

COPY setup.py .
RUN python -m pip install .
