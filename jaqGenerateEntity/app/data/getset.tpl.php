    public function get<Name>() : <type>
    {
        return $this-><name>;
    }

    public function set<Name>(<type> $<name>) : self
    {
        $this-><name> = $<name>;

        return $this;
    }
